import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { DailyPomodoro, DisplayTermType, HistoryDataSet } from '../../../types'
import {
  NUMBER_OF_DAY_BY_WEEK,
  NUMBER_OF_MONTH_BY_YEAR
} from '../../../consts/index'

const useFormatHistoryData = (
  dailyPomodoros: DailyPomodoro[],
  displayTermType: DisplayTermType,
  timesGoBack: number
): HistoryDataSet => {
  const [historyData, setHistoryData] = useState<HistoryDataSet>([])

  useEffect(() => {
    if (displayTermType === 'week') {
      setHistoryData(formatWeeklyHistoryData(dailyPomodoros))
    } else if (displayTermType === 'month') {
      setHistoryData(formatMonthlyHisotryData(dailyPomodoros))
    } else {
      setHistoryData(formatYearlyHisotryData(dailyPomodoros))
    }
  }, [displayTermType, timesGoBack])

  const formatWeeklyHistoryData = (
    dailyPomodoros: DailyPomodoro[]
  ): HistoryDataSet => {
    const weeklyHistoryData: HistoryDataSet = []
    const specifiedDay = dayjs().subtract(timesGoBack, 'week')
    // TODO: 月を跨ぐとバグる？
    const lastMonth = dailyPomodoros.filter(
      (obj) =>
        obj.year === specifiedDay.year() &&
        obj.month === specifiedDay.month() + 1
    )
    const lastDaysOfMonth = lastMonth.map((obj) => {
      return obj.day
    })
    const day = specifiedDay.day()
    for (let i = 0; i < NUMBER_OF_DAY_BY_WEEK; i++) {
      const targetDate = specifiedDay.subtract(day - i, 'd').date()
      const index = lastDaysOfMonth.indexOf(targetDate)
      if (index !== -1) {
        weeklyHistoryData.push({
          name: String(lastMonth[index].day),
          count: lastMonth[index].count
        })
        continue
      }
      weeklyHistoryData.push({
        name: String(specifiedDay.add(i - day, 'day').date()),
        count: 0
      })
    }
    return weeklyHistoryData
  }

  const formatMonthlyHisotryData = (
    dailyPomodoros: DailyPomodoro[]
  ): HistoryDataSet => {
    const historyDataSet: HistoryDataSet = []
    const targetDay = dayjs().subtract(timesGoBack, 'month')
    const endOfDate = targetDay.endOf('month').date()
    const lastMonth = dailyPomodoros.filter(
      (obj) =>
        obj.year === targetDay.year() && obj.month === targetDay.month() + 1
    )
    const lastDaysOfMonth = lastMonth.map((obj) => {
      return obj.day
    })

    for (let i = 1; i <= endOfDate; i++) {
      const index = lastDaysOfMonth.indexOf(i)
      if (index !== -1) {
        historyDataSet.push({
          name:
            String(targetDay.month() + 1) + '/' + String(lastMonth[index].day),
          count: lastMonth[index].count
        })
        continue
      }
      historyDataSet.push({
        name: String(targetDay.month() + 1) + '/' + String(i),
        count: 0
      })
    }
    return historyDataSet
  }

  const formatYearlyHisotryData = (
    dailyPomodoros: DailyPomodoro[]
  ): HistoryDataSet => {
    const yearlyHisotryData: HistoryDataSet = []
    const specifiedDay = dayjs().subtract(timesGoBack, 'year')
    // 指定年の実施ポモドーロ
    const pomodorosOfSpecifiedYear = dailyPomodoros.filter(
      (obj) => obj.year === specifiedDay.year()
    )
    let monthlyPomodoros: DailyPomodoro[] = []
    monthlyPomodoros = pomodorosOfSpecifiedYear.reduce(
      (dailyPomodoros, current) => {
        const element = dailyPomodoros.find(
          (dailyPomodoro: DailyPomodoro) =>
            dailyPomodoro.month === current.month
        )
        if (element != null) {
          element.count += current.count
        } else {
          dailyPomodoros.push({
            year: current.year,
            month: current.month,
            day: current.day,
            count: current.count
          })
        }
        return dailyPomodoros
      },
      monthlyPomodoros
    )

    // ポモドーロを実施した月
    const focusedMonths = monthlyPomodoros.map((obj) => {
      return obj.month
    })

    for (let i = 1; i <= NUMBER_OF_MONTH_BY_YEAR; i++) {
      const index = focusedMonths.indexOf(i)
      if (index !== -1) {
        yearlyHisotryData.push({
          name: String(monthlyPomodoros[index].month),
          count: monthlyPomodoros[index].count
        })
        continue
      }
      yearlyHisotryData.push({
        name: String(i),
        count: 0
      })
    }
    return yearlyHisotryData
  }

  return historyData
}

export default useFormatHistoryData
