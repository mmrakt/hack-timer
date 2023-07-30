const translation = {
  description: 'A simple pomodoro timer to improve productivity.',
  common: {
    pomodoro: 'Focus',
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
        pomodoro: 'Focus Length',
        break: 'Break Length',
        longBreak: 'Long Break Length',
        unit: 'min'
      },
      count: {
        untilLongBreak: 'Until Long Break',
        unit: ''
      }
    },
    notification: {
      title: 'Notification',
      showNewTab: {
        pomodoro: 'Notify new tab when finished focus',
        break: 'Notify new tab when finished break'
      },
      desktop: {
        pomodoro: 'Notify desktop when finished focus',
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
      title: 'Finished focus',
      message: 'Today - %f Focus\nUntil long break - %s Focus'
    },
    break: {
      title: 'Finished break',
      message: 'Today - %f Focus\nUntil long break - %s Focus'
    }
  },
  expire: {
    title: 'Finished %f',
    message: 'Today - %f Focus\nUntil long break - %s Focus',
    buttonText: 'Start %f'
  }
}

export { translation }
