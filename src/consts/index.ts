import { Phase } from "../types";

export const REMINING_SECONDS: {
  [T in Phase]: number;
} = {
  focus: 1500,
  shortBreak: 300,
  longBreak: 1800,
};
