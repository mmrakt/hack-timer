import { StorageKey, Phase, PopupMessage } from "../types/index";
import keepAlive from "./KeepAliveServiceWorker";

let intervalId = 0;

// installed event
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.sync.set({
    reminingSeconds: 1500,
    phase: "focus",
    isRunning: false,
    pomodoros: 0,
  });
  await chrome.storage.sync.get(null, (v) => {
    console.log(v);
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
        chrome.storage.sync.get(
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
    }
    return true;
  }
);

// ステータスの切り替えとインターバルの管理
const handleTimer = async () => {
  await keepAlive();

  await chrome.storage.sync.get(
    ["reminingSeconds", "phase", "isRunning", "pomodoros"],
    async ({ reminingSeconds, phase, isRunning, pomodoros }) => {
      isRunning = isRunning ? false : true;
      try {
        await chrome.storage.sync.set({ isRunning });
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
  chrome.storage.sync.get(
    ["reminingSeconds", "phase", "pomodoros"],
    async ({ reminingSeconds, phase, pomodoros }) => {
      if (reminingSeconds > 0) {
        await countDown(reminingSeconds);
      }

      if (reminingSeconds === 0) {
        await finished(phase, pomodoros);
      }
    }
  );
};

// カウントを減らす
const countDown = async (reminingSeconds: number) => {
  try {
    await chrome.storage.sync.set({ reminingSeconds: reminingSeconds - 1 });
  } catch (e) {
    console.error(e);
  }
};

// カウントダウンを終了する
const finished = async (phase: Phase, pomodoros: number) => {
  const isFinisheSession = pomodoros === 4 ? true : false;
  const nextPhase =
    phase === "focus"
      ? isFinisheSession
        ? "longBreak"
        : "shortBreak"
      : "focus";
  let nextReminingSeconds = 0;
  switch (nextPhase) {
    case "focus":
      nextReminingSeconds = 1500;
      break;
    case "shortBreak":
      nextReminingSeconds = 300;
      break;
    case "longBreak":
      nextReminingSeconds = 1800;
  }
  try {
    await chrome.storage.sync.set({
      reminingSeconds: nextReminingSeconds,
      phase: nextPhase,
      pomodoros: isFinisheSession ? 0 : pomodoros + 1,
      isRunning: false,
    });
    toggleInterval(false);
  } catch (e) {
    console.error(e);
  }
};
