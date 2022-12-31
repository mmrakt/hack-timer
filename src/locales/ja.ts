const translation = {
  settings: {
    timer: {
      title: 'タイマー',
      length: {
        pomodoro: 'ポモドーロの長さ',
        break: '休憩の長さ',
        longBreak: '長い休憩の長さ',
        unit: '分'
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
    import: {
      buttonText: '履歴を更新する',
      confirmMessage: '履歴を更新しますか？'
    },
    export: {
      buttonText: '履歴をダウンロードする'
    }
  },
  notifications: {
    title: 'ポモドーロが終了しました',
    message: '現在のポモドーロ数は〇〇です'
  }
}

export { translation }
