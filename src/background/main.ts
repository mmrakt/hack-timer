import { Phase, PopupMessage, DailyFocusedCount } from "../types/index";
import keepAlive from "./keepAliveServiceWorker";
import Time from "../utils/Time";
import dayjs from "dayjs";

let intervalId = 0;

// installed event
chrome.runtime.onInstalled.addListener(async () => {
  const reminingSeconds = 1500;
  const phase: Phase = "focus";
  await chrome.storage.local.set({
    reminingSeconds,
    phase,
    isRunning: false,
    totalFocusedCountInSession: 0,
    dailyFocusedCounts: [],
  });
  await updateSecondsOfBadge(reminingSeconds);
  await updateColorOfBadge(phase);
});

// shortcut key event
chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "toggle_timer_status":
      await handleTimer();
      break;
  }
});

// popup event
chrome.runtime.onMessage.addListener(
  (message: PopupMessage, sender, sendResponse) => {
    switch (message) {
      case "mounted":
        chrome.storage.local.get(
          [
            "reminingSeconds",
            "phase",
            "isRunning",
            "totalFocusedCountInSession",
          ],
          (result) => {
            sendResponse(result);
          }
        );
        break;
      case "toggleTimerStatus":
        handleTimer();
        sendResponse();
        break;
      case "finish":
        chrome.storage.local.get(
          ["phase", "totalFocusedCountInSession", "dailyFocusedCounts"],
          async (result) => {
            await finish(
              result.phase,
              result.totalFocusedCountInSession,
              result.dailyFocusedCounts
            );
          }
        );
      case "displayHistory":
        chrome.storage.local.get(["dailyFocusedCounts"], (result) => {
          sendResponse(result);
        });
    }
    return true;
  }
);

// ステータスの切り替えとインターバルの管理
const handleTimer = async () => {
  await keepAlive();

  await chrome.storage.local.get(
    ["reminingSeconds", "phase", "isRunning", "totalFocusedCountInSession"],
    async ({
      reminingSeconds,
      phase,
      isRunning,
      totalFocusedCountInSession,
    }) => {
      isRunning = isRunning ? false : true;
      try {
        await chrome.storage.local.set({
          isRunning,
        });
        toggleInterval(isRunning);
      } catch (e) {
        console.error(e);
      }
    }
  );
};

const toggleInterval = (isRunning: boolean) => {
  if (isRunning) {
    intervalId = setInterval(handleCountDown, 1000);
  } else {
    clearInterval(intervalId);
    intervalId = 0;
  }
};

// running時は毎秒実行され、カウントを減らすか終了させるか判定
const handleCountDown = () => {
  chrome.storage.local.get(
    [
      "reminingSeconds",
      "phase",
      "totalFocusedCountInSession",
      "dailyFocusedCounts",
    ],
    async ({
      reminingSeconds,
      phase,
      totalFocusedCountInSession,
      dailyFocusedCounts,
    }) => {
      if (reminingSeconds > 0) {
        await countDown(reminingSeconds);
      }

      if (reminingSeconds === 0) {
        await finish(phase, totalFocusedCountInSession, dailyFocusedCounts);
      }
    }
  );
};

// カウントを減らす
const countDown = async (reminingSeconds: number) => {
  try {
    await chrome.storage.local.set({ reminingSeconds: reminingSeconds - 1 });
    await updateSecondsOfBadge(reminingSeconds - 1);
    await chrome.runtime.sendMessage({
      message: "countDown",
      secs: reminingSeconds,
    });
  } catch (e) {
    console.error(e);
  }
};

const updateSecondsOfBadge = async (reminingSeconds: number) => {
  const { seconds, minutes } = Time.getTimeFromSeconds(reminingSeconds);
  let formatSeconds = String(seconds);
  if (formatSeconds.substring(0, 1) === "0") {
    formatSeconds = "00";
  }
  const text = minutes + ":" + formatSeconds;
  await chrome.action.setBadgeText({ text });
};

const updateColorOfBadge = async (phase: Phase) => {
  const color = phase === "focus" ? "#0c4a6e" : "#374151";
  await chrome.action.setBadgeBackgroundColor({ color });
};

const finish = async (
  currentPhase: Phase,
  totalFocusedCountInSession: number,
  dailyFocusedCounts: DailyFocusedCount[]
) => {
  let reminingSeconds = 0;
  let nextPhase: Phase = "focus";
  let nextTotalFocusedCountInSession = totalFocusedCountInSession;
  if (currentPhase === "focus") {
    if (totalFocusedCountInSession === 3) {
      reminingSeconds = 1800;
      nextTotalFocusedCountInSession = 0;
      nextPhase = "longBreak";
    } else {
      reminingSeconds = 300;
      nextTotalFocusedCountInSession++;
      nextPhase = "shortBreak";
    }
    dailyFocusedCounts = addDailyFocusedCount(dailyFocusedCounts);
  } else {
    reminingSeconds = 1500;
  }
  try {
    await chrome.storage.local.set({
      reminingSeconds: reminingSeconds,
      phase: nextPhase,
      totalFocusedCountInSession: nextTotalFocusedCountInSession,
      isRunning: false,
      dailyFocusedCounts,
    });
    await updateSecondsOfBadge(reminingSeconds);
    await updateColorOfBadge(nextPhase);
    await chrome.runtime.sendMessage({
      message: "finish",
      secs: reminingSeconds,
      phase: nextPhase,
    });
    toggleInterval(false);
  } catch (e) {
    console.error(e);
  }
};

const addDailyFocusedCount = (dailyFocusedCounts: DailyFocusedCount[]) => {
  const today = dayjs();
  const year = today.year();
  const month = today.month();
  const day = today.date();

  const lastFocusedDate = dailyFocusedCounts.slice(-1)[0];
  if (
    lastFocusedDate.year === year &&
    lastFocusedDate.month === month &&
    lastFocusedDate.day === day
  ) {
    dailyFocusedCounts.slice(-1)[0].count++;
    return dailyFocusedCounts;
  }
  dailyFocusedCounts.push({
    year,
    month,
    day,
    count: 1,
  });

  return dailyFocusedCounts;
};
