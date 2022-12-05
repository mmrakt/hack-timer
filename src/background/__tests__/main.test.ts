import { finish } from '../main'
import MockDate from 'mockdate'
import { chrome } from 'jest-chrome'
import {
  BREAK_BADGE_COLOR_CODE,
  FOCUS_BADGE_COLOR_CODE,
  REMINING_SECONDS,
  FOCUS_COUNT_UNTIL_LONG_BREAK
} from '../../consts/index'

describe('service worker', () => {
  beforeEach(() => {
    MockDate.set('2022-12-01')
  })

  afterEach(() => {
    MockDate.reset()
  })
  it('finish first focus', async () => {
    const expected = {
      reminingSeconds: REMINING_SECONDS.shortBreak,
      phase: 'shortBreak',
      totalFocusedCountInSession: 1,
      isRunning: false,
      dailyFocusedCounts: [
        {
          year: 2022,
          month: 11,
          day: 1,
          count: 1
        }
      ]
    }
    const expectedOptions = {
      message: 'finish',
      secs: expected.reminingSeconds,
      phase: expected.phase
    }
    const expectedBadgeText = '00:06'
    const expectedBadgeBackgroundColor = BREAK_BADGE_COLOR_CODE

    await finish('focus', 0, [])

    expect(chrome.storage.local.set).toBeCalledWith(expected)
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

  it('finish first short break', async () => {
    const expected = {
      reminingSeconds: REMINING_SECONDS.focus,
      phase: 'focus',
      totalFocusedCountInSession: 1,
      isRunning: false,
      dailyFocusedCounts: [
        {
          year: 2022,
          month: 11,
          day: 1,
          count: 1
        }
      ]
    }
    const expectedOptions = {
      message: 'finish',
      secs: expected.reminingSeconds,
      phase: expected.phase
    }
    const expectedBadgeText = '00:10'
    const expectedBadgeBackgroundColor = FOCUS_BADGE_COLOR_CODE

    await finish('shortBreak', 1, [
      {
        year: 2022,
        month: 11,
        day: 1,
        count: 1
      }
    ])

    expect(chrome.storage.local.set).toBeCalledWith(expected)
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
    const expected = {
      reminingSeconds: REMINING_SECONDS.longBreak,
      phase: 'longBreak',
      totalFocusedCountInSession: 0,
      isRunning: false,
      dailyFocusedCounts: [
        {
          year: 2022,
          month: 11,
          day: 1,
          count: 4
        }
      ]
    }
    const expectedOptions = {
      message: 'finish',
      secs: expected.reminingSeconds,
      phase: expected.phase
    }
    const expectedBadgeText = '30:00'
    const expectedBadgeBackgroundColor = BREAK_BADGE_COLOR_CODE
    await finish('focus', FOCUS_COUNT_UNTIL_LONG_BREAK - 1, [
      {
        year: 2022,
        month: 11,
        day: 1,
        count: 3
      }
    ])

    expect(chrome.storage.local.set).toBeCalledWith(expected)
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
