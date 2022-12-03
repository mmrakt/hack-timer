import { Phase } from "../types";

export const REMINING_SECONDS: {
  [T in Phase]: number;
} = {
  focus: 5,
  shortBreak: 6,
  longBreak: 1800,
};
