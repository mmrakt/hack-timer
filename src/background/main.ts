import { Phase, PopupMessage } from "../types/index";
import keepAlive from "./keepAliveServiceWorker";

let intervalId = 0;

// installed event
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({
    reminingSeconds: 1500,
    phase: "focus",
    isRunning: false,
    pomodoros: 0,
  });
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
    await chrome.runtime.sendMessage({
      message: "countDown",
      secs: reminingSeconds,
    });
  } catch (e) {
    console.error(e);
  }
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
