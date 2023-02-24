import { renderHook } from '@testing-library/react'
import {
  DailyPomodoro,
  DisplayTermType,
  HistoryDataSet
} from '../../../types/index'
import useFormatHistoryData from './useFormatHisotryData'

const d = new Date()
const thisYear = d.getFullYear()
const thisMonth = d.getMonth() + 1

describe('year', () => {
  let dailyPomodoros: DailyPomodoro[] = []
  let timesGoBack = 0
  const displayTermType: DisplayTermType = 'year'
  const expectHistoryData: HistoryDataSet = [
    { name: '1', count: 0 },
    { name: '2', count: 0 },
    { name: '3', count: 0 },
    { name: '4', count: 0 },
    { name: '5', count: 0 },
    { name: '6', count: 0 },
    { name: '7', count: 0 },
    { name: '8', count: 0 },
    { name: '9', count: 0 },
    { name: '10', count: 0 },
    { name: '11', count: 0 },
    { name: '12', count: 0 }
  ]
  it('initial display', () => {
    dailyPomodoros = [
      {
        year: thisYear,
        month: 12,
        day: 1,
        count: 10
      },
      {
        year: thisYear,
        month: 12,
        day: 3,
        count: 5
      },
      {
        year: thisYear,
        month: 11,
        day: 4,
        count: 3
      },
      {
        year: thisYear,
        month: 9,
        day: 10,
        count: 10
      }
    ]
    const { result } = renderHook(() =>
      useFormatHistoryData(dailyPomodoros, displayTermType, timesGoBack)
    )
    expectHistoryData[11].count = 15 // 12月：15回
    expectHistoryData[10].count = 3 // 11月：3回
    expectHistoryData[8].count = 10 // 9月：10回

    expect(result.current).toStrictEqual(expectHistoryData)
  })
  it('a year ago', () => {
    dailyPomodoros = [
      {
        year: thisYear,
        month: 12,
        day: 1,
        count: 10
      },
      {
        year: thisYear - 1,
        month: 12,
        day: 3,
        count: 5
      },
      {
        year: thisYear - 1,
        month: 11,
        day: 4,
        count: 3
      },
      {
        year: thisYear - 1,
        month: 9,
        day: 10,
        count: 10
      }
    ]
    timesGoBack = 1
    const { result } = renderHook(() =>
      useFormatHistoryData(dailyPomodoros, displayTermType, timesGoBack)
    )
    expectHistoryData[11].count = 5 // 12月：5回
    expectHistoryData[10].count = 3 // 11月：3回
    expectHistoryData[8].count = 10 // 9月：10回

    expect(result.current).toStrictEqual(expectHistoryData)
  })
  it('empty pomodoro', () => {
    const { result } = renderHook(() =>
      useFormatHistoryData(dailyPomodoros, displayTermType, timesGoBack)
    )
    expect(result.current).toStrictEqual(expectHistoryData)
  })
})

describe('month', () => {
  const displayTermType: DisplayTermType = 'month'

  it('initial display', () => {
    const expectHistoryData = getExpectHistoryData(thisMonth)
    const dailyPomodoros: DailyPomodoro[] = [
      {
        year: thisYear,
        month: thisMonth,
        day: 1,
        count: 10
      },
      {
        year: thisYear,
        month: thisMonth,
        day: 3,
        count: 5
      },
      {
        year: thisYear,
        month: thisMonth + 1,
        day: 4,
        count: 3
      }
    ]
    const timesGoBack = 0

    const { result } = renderHook(() =>
      useFormatHistoryData(dailyPomodoros, displayTermType, timesGoBack)
    )
    expectHistoryData[0].count = 10 // 1日：10回
    expectHistoryData[2].count = 5 // 3日：5回

    expect(result.current).toStrictEqual(expectHistoryData)
  })
  it('empty pomodoro', () => {
    const dailyPomodoros: DailyPomodoro[] = []
    const timesGoBack = 0
    const expectHistoryData = getExpectHistoryData(thisMonth)
    const { result } = renderHook(() =>
      useFormatHistoryData(dailyPomodoros, displayTermType, timesGoBack)
    )
    expect(result.current).toStrictEqual(expectHistoryData)
  })
  it('a month ago', () => {
    const expectHistoryData = getExpectHistoryData(thisMonth - 1)
    const dailyPomodoros: DailyPomodoro[] = [
      {
        year: thisYear,
        month: thisMonth - 1,
        day: 1,
        count: 10
      },
      {
        year: thisYear,
        month: thisMonth - 1,
        day: 3,
        count: 5
      },
      {
        year: thisYear,
        month: thisMonth,
        day: 4,
        count: 3
      }
    ]
    const timesGoBack = 1

    const { result } = renderHook(() =>
      useFormatHistoryData(dailyPomodoros, displayTermType, timesGoBack)
    )
    expectHistoryData[0].count = 10 // 1日：10回
    expectHistoryData[2].count = 5 // 3日：5回

    expect(result.current).toStrictEqual(expectHistoryData)
  })
})

// eslint-disable-next-line
function getExpectHistoryData(month: number): HistoryDataSet {
  const historyData: HistoryDataSet = []
  const numberOfMonth = new Date(thisYear, month, 0).getDate()
  for (let i = 1; i <= numberOfMonth; i++) {
    const history = {
      name: String(month) + '/' + String(i),
      count: 0
    }
    historyData.push(history)
  }
  return historyData
}
