export enum FromPopupMessageType {
  DISPLAY_POPUP = 'display-popup',
  RESUME = 'resume',
  PAUSE = 'pause',
  EXPIRE = 'expire'
}

export enum FromServiceWorkerMessageType {
  REDUCE_COUNT = 'reduce-count',
  TOGGLE_TIMER_STATUS = 'toggle-timer-status',
  EXPIRE = 'expire'
}
