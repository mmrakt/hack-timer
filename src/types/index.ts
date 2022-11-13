export type Message = {
  type: "hoge";
};

export type Response = {
  id: string;
};

export type Phase = "focus" | "shortBreak" | "longBreak";

export type PageType = "timer" | "history" | "setting";

export type StorageValue = {
  reminingSeconds: number;
  phase: Phase;
  pomodoros: number;
  isRunning: boolean;
};

export type StorageKey =
  | "reminingSeconds"
  | "phase"
  | "isRunning"
  | "pomodoros";

export type PopupMessage = "mounted" | "toggleTimerStatus";
