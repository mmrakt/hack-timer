import MockDate from 'mockdate'
import { chrome } from 'jest-chrome'
import { DEFAULT_TIMER_SECONDS } from '../../consts/index'
import { expire } from '../Timer'
import { Message } from '../../types/index'
import { FromServiceWorkerMessgeType } from '../../utils/message'
import { COLOR } from '../../consts/color'

describe('Timer', () => {
  beforeEach(() => {
    MockDate.set('2022-12-01')
  })

  afterEach(() => {
    MockDate.reset()
  })
  // TODO: service worker側でonMessageで受け取れなくなった原因調査
  // it.only('resume', async () => {
  //   const listenerSpy = jest.fn()
  //   const sendResponseSpy = jest.fn()
  //   const message = 'resume'

  //   chrome.runtime.onMessage.addListener(listenerSpy)
  //   chrome.runtime.onMessage.callListeners(message, {}, sendResponseSpy)

  //   expect(listenerSpy).toBeCalledWith(message, {}, sendResponseSpy)
  //   expect(chrome.storage.local.set).toBeCalledWith({ isRunning: true })
  //   expect(chrome.tabs.query).toBeCalled()
  // })

  // it('pause', async () => {
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
      reminingSeconds: DEFAULT_TIMER_SECONDS.break,
      phase: 'break',
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
    const todayTotalPomodoroCount = 0
    const expectedOptions: Message = {
      type: FromServiceWorkerMessgeType.EXPIRE,
      data: {
        secs: expectedSetValue.reminingSeconds,
        phase: expectedSetValue.phase,
        pomodorosUntilLongBreak,
        todayTotalPomodoroCount: todayTotalPomodoroCount + 1,
        totalPomodoroCountsInSession:
          expectedSetValue.totalPomodoroCountsInSession
      }
    }
    const expectedBadgeText = '05:00'
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
      reminingSeconds: DEFAULT_TIMER_SECONDS.focus,
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
      type: FromServiceWorkerMessgeType.EXPIRE,
      data: {
        secs: expectedSetValue.reminingSeconds,
        phase: expectedSetValue.phase,
        pomodorosUntilLongBreak,
        todayTotalPomodoroCount,
        totalPomodoroCountsInSession:
          expectedSetValue.totalPomodoroCountsInSession
      }
    }
    const expectedBadgeText = '25:00'
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
      reminingSeconds: DEFAULT_TIMER_SECONDS.longBreak,
      phase: 'longBreak',
      totalPomodoroCountsInSession: 0,
      isRunning: false,
      dailyPomodoros: [
        {
          year: 2022,
          month: 11,
          day: 1,
          count: 4
        }
      ]
    }
    const pomodorosUntilLongBreak = 4
    const todayTotalPomodoroCount = 3
    const expectedOptions = {
      type: FromServiceWorkerMessgeType.EXPIRE,
      data: {
        secs: expectedSetValue.reminingSeconds,
        phase: expectedSetValue.phase,
        pomodorosUntilLongBreak,
        todayTotalPomodoroCount: todayTotalPomodoroCount + 1,
        totalPomodoroCountsInSession:
          expectedSetValue.totalPomodoroCountsInSession
      }
    }
    const expectedBadgeText = '30:00'
    const expectedBadgeBackgroundColor = COLOR.secondary
    await expire(
      'focus',
      3,
      [
        {
          year: 2022,
          month: 11,
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
      reminingSeconds: DEFAULT_TIMER_SECONDS.longBreak,
      phase: 'longBreak',
      totalPomodoroCountsInSession: 0,
      isRunning: false,
      dailyPomodoros: [
        {
          year: 2022,
          month: 11,
          day: 1,
          count: 4
        }
      ]
    }
    const expectedOptions = {
      type: FromServiceWorkerMessgeType.EXPIRE,
      data: {
        secs: expectedSetValue.reminingSeconds,
        phase: expectedSetValue.phase,
        pomodorosUntilLongBreak: changedPomodorosUntilLongBreak,
        todayTotalPomodoroCount: 4,
        totalPomodoroCountsInSession:
          expectedSetValue.totalPomodoroCountsInSession
      }
    }
    const expectedBadgeText = '30:00'
    const expectedBadgeBackgroundColor = COLOR.secondary
    await expire(
      'focus',
      3,
      [
        {
          year: 2022,
          month: 11,
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
