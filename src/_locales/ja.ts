const translation = {
  description: '生産性を向上させるシンプルなポモドーロタイマー。',
  common: {
    pomodoro: '集中',
    break: '休憩',
    longBreak: '長い休憩'
  },
  popup: {
    totalPomodoroCount: '今日 - %f'
  },
  settings: {
    pageTitle: '設定',
    timer: {
      title: 'タイマー',
      length: {
        pomodoro: '集中時間の長さ',
        break: '休憩時間の長さ',
        longBreak: '長い休憩時間の長さ',
        unit: '分'
      },
      count: {
        untilLongBreak: '長い休憩までの集中回数',
        unit: '回'
      }
    },
    notification: {
      title: '通知',
      showNewTab: {
        pomodoro: '集中終了時にタブ表示で通知する',
        break: '休憩終了時にタブ表示で通知する'
      },
      desktop: {
        pomodoro: '集中終了時にデスクトップ通知する',
        break: '休憩終了時にデスクトップ通知する'
      }
    }
  },
  history: {
    pageTitle: '履歴',
    termType: {
      weekly: '週',
      monthly: '月',
      yearly: '年'
    },
    import: {
      buttonText: '履歴を更新',
      confirmMessage: '履歴を更新しますか？'
    },
    export: {
      buttonText: '履歴をダウンロード'
    }
  },
  notifications: {
    pomodoro: {
      title: '集中が終了しました',
      message: '集中回数 - %f 回\n長い休憩まで - %s 回'
    },
    break: {
      title: '休憩が終了しました',
      message: '集中回数 - %f 回\n長い休憩まで - %s 回'
    }
  },
  expire: {
    title: '%fが終了しました',
    message: '集中回数 - %f 回\n長い休憩まで - %s 回',
    buttonText: '%fを開始'
  }
}

export { translation }
