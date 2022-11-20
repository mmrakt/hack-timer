export type Message = {
  type: "hoge";
};

export type Response = {
  id: string;
};

export type Phase = "focus" | "shortBreak" | "longBreak";

export type PageType = "timer" | "history" | "setting";

export type DailyFocusedCount = {
  date: string;
  count: number;
};
export type StorageValue = {
  reminingSeconds: number;
  phase: Phase;
  totalFocusedCountInSession: number;
  dailyFocusedCounts: DailyFocusedCount[];
  isRunning: boolean;
};

export type StorageKey = keyof StorageValue;

export type PopupMessage =
  | "mounted"
  | "toggleTimerStatus"
  | "finish"
  | "displayHistory";

export type DisplayTerm = "week" | "month" | "year";
