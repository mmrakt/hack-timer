import { Phase, PopupMessage } from "../types/index";
import keepAlive from "./keepAliveServiceWorker";
import Time from "../utils/Time";

let intervalId = 0;

// installed event
chrome.runtime.onInstalled.addListener(async () => {
  const reminingSeconds = 1500;
  const phase: Phase = "focus";
  await chrome.storage.local.set({
    reminingSeconds,
    phase,
    isRunning: false,
    pomodoros: 0,
  });
  await updateSecondsOfBadge(reminingSeconds);
  await updateColorOfBadge(phase);
});

// shortcut key event
chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "toggleTimerStatus":
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
          ["reminingSeconds", "phase", "isRunning", "pomodoros"],
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
        chrome.storage.local.get(["phase", "pomodoros"], async (result) => {
          await finish(result.phase, result.pomodoros);
        });
    }
    return true;
  }
);

// ステータスの切り替えとインターバルの管理
const handleTimer = async () => {
  await keepAlive();

  await chrome.storage.local.get(
    ["reminingSeconds", "phase", "isRunning", "pomodoros"],
    async ({ reminingSeconds, phase, isRunning, pomodoros }) => {
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
    ["reminingSeconds", "phase", "pomodoros"],
    async ({ reminingSeconds, phase, pomodoros }) => {
      if (reminingSeconds > 0) {
        await countDown(reminingSeconds);
      }

      if (reminingSeconds === 0) {
        await finish(phase, pomodoros);
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
  if (seconds === 0) {
    formatSeconds = "00";
  }
  const text = minutes + ":" + formatSeconds;
  await chrome.action.setBadgeText({ text });
};

const updateColorOfBadge = async (phase: Phase) => {
  const color = phase === "focus" ? "#0c4a6e" : "#374151";
  await chrome.action.setBadgeBackgroundColor({ color });
};

// カウントダウンを終了する
const finish = async (currentPhase: Phase, pomodoros: number) => {
  let reminingSeconds = 0;
  let nextPhase: Phase = "focus";
  let nextPomodoroCount = pomodoros;
  if (currentPhase === "focus") {
    if (pomodoros === 3) {
      reminingSeconds = 1800;
      nextPomodoroCount = 0;
      nextPhase = "longBreak";
    } else {
      reminingSeconds = 300;
      nextPomodoroCount++;
      nextPhase = "shortBreak";
    }
  } else {
    reminingSeconds = 1500;
  }
  try {
    await chrome.storage.local.set({
      reminingSeconds: reminingSeconds,
      phase: nextPhase,
      pomodoros: nextPomodoroCount,
      isRunning: false,
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
