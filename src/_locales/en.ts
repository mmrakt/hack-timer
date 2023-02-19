const translation = {
  description: 'A simple pomodoro timer to improve productivity.',
  common: {
    pomodoro: 'Pomodoro',
    break: 'Break',
    longBreak: 'Long Break'
  },
  popup: {
    totalPomodoroCount: 'Today - %f'
  },
  settings: {
    pageTitle: 'Setting',
    timer: {
      title: 'Timer',
      length: {
        pomodoro: 'Pomodoro Length',
        break: 'Break Length',
        longBreak: 'Long Break Length',
        unit: 'min'
      },
      count: {
        untilLongBreak: 'Until Long Break',
        unit: 'Pomodoro'
      }
    },
    notification: {
      title: 'Notification',
      showNewTab: {
        pomodoro: 'Notify new tab when finished pomodoro',
        break: 'Notify new tab when finished break'
      },
      desktop: {
        pomodoro: 'Notify desktop when finished pomodoro',
        break: 'Notify desktop when finished break'
      }
    }
  },
  history: {
    pageTitle: 'History',
    termType: {
      weekly: 'Week',
      monthly: 'Month',
      yearly: 'Year'
    },
    import: {
      buttonText: 'Import history',
      confirmMessage: 'Update history?',
      invalidMessage: 'Error: invalid format'
    },
    export: {
      buttonText: 'Export history'
    }
  },
  notifications: {
    pomodoro: {
      title: 'Finished pomodoro',
      message: 'Today - %f Pomodoro\nUntil long break - %s Pomodoro'
    },
    break: {
      title: 'Finished break',
      message: 'Today - %f Pomodoro\nUntil long break - %s Pomodoro'
    }
  },
  expire: {
    title: 'Finished %f',
    message: 'Today - %f Pomodoro\nUntil long break - %s Pomodoro',
    buttonText: 'Start %f'
  }
}

export { translation }
