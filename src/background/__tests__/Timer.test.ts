import MockDate from 'mockdate'
import { chrome } from 'jest-chrome'
// import { DEFAULT_TIMER_SECONDS } from '../../consts/index'
import { expire } from '../Timer'
import { Message } from '../../types/index'
import { FromServiceWorkerMessageType } from '../../utils/message'
import { COLOR } from '../../consts/color'

describe.skip('Timer', () => {
  beforeEach(() => {
    MockDate.set('2022-12-01')
  })

  afterEach(() => {
    MockDate.reset()
  })
  it('resume', () => {
    const listenerSpy = jest.fn()
    const sendResponseSpy = jest.fn()
    const message = 'resume'

    chrome.runtime.onMessage.addListener(listenerSpy)
    chrome.runtime.onMessage.callListeners(message, {}, sendResponseSpy)

    expect(listenerSpy).toBeCalledWith(message, {}, sendResponseSpy)
    // TODO: fix
    // expect(chrome.storage.local.set).toBeCalledWith({ isRunning: true })
    // expect(chrome.tabs.query).toBeCalled()
  })

  // it('pause', () => {
  //   const listenerSpy = jest.fn()
  //   const sendResponseSpy = jest.fn()
  //   const message = 'pause'

  //   chrome.runtime.onMessage.addListener(listenerSpy)
  //   chrome.runtime.onMessage.callListeners(message, {}, sendResponseSpy)

  //   expect(listenerSpy).toBeCalledWith(message, {}, sendResponseSpy)
  //   expect(chrome.storage.local.set).toBeCalledWith({ isRunning: false })
  // })

  it('finish first focus', async () => {
    const expectedSetValue = {
      remainingSeconds: 0, // TODO: getStorageのPromiseが解決されないままテストが終わる原因調査
      phase: 'break',
      totalPomodoroCountsInSession: 1,
      isRunning: false,
      dailyPomodoros: [
        {
          year: 2022,
          month: 12,
          day: 1,
          count: 1
        }
      ]
    }
    const pomodorosUntilLongBreak = 4
    const todayTotalPomodoroCount = 0
    const expectedOptions: Message = {
      type: FromServiceWorkerMessageType.EXPIRE,
      data: {
        secs: 0, // FIXME
        phase: expectedSetValue.phase,
        pomodorosUntilLongBreak,
        todayTotalPomodoroCount: todayTotalPomodoroCount + 1,
        totalPomodoroCountsInSession:
          expectedSetValue.totalPomodoroCountsInSession
      }
    }
    const expectedBadgeText = '00:00' // FIXME
    const expectedBadgeBackgroundColor = COLOR.secondary

    await expire('focus', 0, [], 4)

    expect(chrome.storage.local.set).toBeCalledWith(expectedSetValue)
    // @ts-expect-error
    expect(chrome.action.setBadgeText).toBeCalledWith({
      text: expectedBadgeText
    })
    // @ts-expect-error
    expect(chrome.action.setBadgeBackgroundColor).toBeCalledWith({
      color: expectedBadgeBackgroundColor
    })
    expect(chrome.runtime.sendMessage).toBeCalledWith(expectedOptions)
  })

  it('finish first break', async () => {
    const expectedSetValue = {
      remainingSeconds: 0, // FIXME
      phase: 'focus',
      totalPomodoroCountsInSession: 1,
      isRunning: false,
      dailyPomodoros: [
        {
          year: 2022,
          month: 11,
          day: 1,
          count: 1
        }
      ]
    }
    const pomodorosUntilLongBreak = 4
    const todayTotalPomodoroCount = 1
    const expectedOptions: Message = {
      type: FromServiceWorkerMessageType.EXPIRE,
      data: {
        secs: 0, // FIXME
        phase: expectedSetValue.phase,
        pomodorosUntilLongBreak,
        todayTotalPomodoroCount,
        totalPomodoroCountsInSession:
          expectedSetValue.totalPomodoroCountsInSession
      }
    }
    const expectedBadgeText = '00:00' // FIXME
    const expectedBadgeBackgroundColor = COLOR.primary

    await expire(
      'break',
      1,
      [
        {
          year: 2022,
          month: 11,
          day: 1,
          count: 1
        }
      ],
      4
    )

    expect(chrome.storage.local.set).toBeCalledWith(expectedSetValue)
    // @ts-expect-error
    expect(chrome.action.setBadgeText).toBeCalledWith({
      text: expectedBadgeText
    })
    // @ts-expect-error
    expect(chrome.action.setBadgeBackgroundColor).toBeCalledWith({
      color: expectedBadgeBackgroundColor
    })
    expect(chrome.runtime.sendMessage).toBeCalledWith(expectedOptions)
  })

  it('start long break', async () => {
    const expectedSetValue = {
      remainingSeconds: 0, // FIXME
      phase: 'longBreak',
      totalPomodoroCountsInSession: 0,
      isRunning: false,
      dailyPomodoros: [
        {
          year: 2022,
          month: 12,
          day: 1,
          count: 4
        }
      ]
    }
    const pomodorosUntilLongBreak = 4
    const todayTotalPomodoroCount = 3
    const expectedOptions = {
      type: FromServiceWorkerMessageType.EXPIRE,
      data: {
        secs: 0, // FIEXME
        phase: expectedSetValue.phase,
        pomodorosUntilLongBreak,
        todayTotalPomodoroCount: todayTotalPomodoroCount + 1,
        totalPomodoroCountsInSession:
          expectedSetValue.totalPomodoroCountsInSession
      }
    }
    const expectedBadgeText = '00:00' // FIXME
    const expectedBadgeBackgroundColor = COLOR.secondary
    await expire(
      'focus',
      3,
      [
        {
          year: 2022,
          month: 12,
          day: 1,
          count: 3
        }
      ],
      4
    )

    expect(chrome.storage.local.set).toBeCalledWith(expectedSetValue)
    // @ts-expect-error
    expect(chrome.action.setBadgeText).toBeCalledWith({
      text: expectedBadgeText
    })
    // @ts-expect-error
    expect(chrome.action.setBadgeBackgroundColor).toBeCalledWith({
      color: expectedBadgeBackgroundColor
    })
    expect(chrome.runtime.sendMessage).toBeCalledWith(expectedOptions)
  })

  it('長い休憩までのポモドーロ数を実施済みポモドーロ数以下に設定した場合。実施数3 長い休憩までのポモドーロ数4 変更後2', async () => {
    const changedPomodorosUntilLongBreak = 2
    const expectedSetValue = {
      remainingSeconds: 0, // FIXME
      phase: 'longBreak',
      totalPomodoroCountsInSession: 0,
      isRunning: false,
      dailyPomodoros: [
        {
          year: 2022,
          month: 12,
          day: 1,
          count: 4
        }
      ]
    }
    const expectedOptions = {
      type: FromServiceWorkerMessageType.EXPIRE,
      data: {
        secs: 0, // FIXME
        phase: expectedSetValue.phase,
        pomodorosUntilLongBreak: changedPomodorosUntilLongBreak,
        todayTotalPomodoroCount: 4,
        totalPomodoroCountsInSession:
          expectedSetValue.totalPomodoroCountsInSession
      }
    }
    const expectedBadgeText = '00:00' // FIXME
    const expectedBadgeBackgroundColor = COLOR.secondary
    await expire(
      'focus',
      3,
      [
        {
          year: 2022,
          month: 12,
          day: 1,
          count: 3
        }
      ],
      changedPomodorosUntilLongBreak
    )

    expect(chrome.storage.local.set).toBeCalledWith(expectedSetValue)
    // @ts-expect-error
    expect(chrome.action.setBadgeText).toBeCalledWith({
      text: expectedBadgeText
    })
    // @ts-expect-error
    expect(chrome.action.setBadgeBackgroundColor).toBeCalledWith({
      color: expectedBadgeBackgroundColor
    })
    expect(chrome.runtime.sendMessage).toBeCalledWith(expectedOptions)
  })
})
