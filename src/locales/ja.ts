const translation = {
  common: {
    pomodoro: 'ポモドーロ',
    break: '休憩',
    longBreak: '長い休憩'
  },
  popup: {
    totalPomodoroCount: '今日 - %f'
  },
  settings: {
    timer: {
      title: 'タイマー',
      length: {
        pomodoro: 'ポモドーロの長さ',
        break: '休憩の長さ',
        longBreak: '長い休憩の長さ',
        unit: '分'
      },
      count: {
        untilLongBreak: '長い休憩までのポモドーロ回数',
        unit: '回'
      }
    },
    notification: {
      title: '通知',
      showNewTab: {
        pomodoro: 'ポモドーロ終了時にタブ表示で通知する',
        break: '休憩終了時にタブ表示で通知する'
      },
      desktop: {
        pomodoro: 'ポモドーロ終了時にデスクトップ通知する',
        break: '休憩終了時にデスクトップ通知する'
      }
    }
  },
  history: {
    termType: {
      weekly: '週',
      monthly: '月',
      yearly: '年'
    },
    import: {
      buttonText: '履歴を更新する',
      confirmMessage: '履歴を更新しますか？'
    },
    export: {
      buttonText: '履歴をダウンロードする'
    }
  },
  notifications: {
    pomodoro: {
      title: 'ポモドーロが終了しました',
      message: 'ポモドーロ数 - %f 回\n長い休憩まで - %s 回'
    },
    break: {
      title: '休憩が終了しました',
      message: 'ポモドーロ - %f 回\n長い休憩まで - %s 回'
    }
  },
  expire: {
    title: '%fが終了しました',
    message: 'ポモドーロ数 - %f 回\n長い休憩まで - %s 回',
    buttonText: '%fを開始'
  }
}

export { translation }
