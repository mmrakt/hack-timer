import { useState, useEffect, useContext } from 'react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import dayjs from 'dayjs'
import { DailyPomodoro, DisplayTermType, HistoryDataSet } from '../../types'
import LoadingSpinner from '../LoadingSpinner'
import { COLOR } from '../../consts/color'
import { ThemeContext } from '../../popup/Popup'

const pStyle = {
  color: '#f4f4f4'
}

const divStyle = {
  background: '#181818',
  opacity: 0.9,
  fontWeight: 'bold',
  border: 'solid 1px #353a45'
}

const chartStrokeColorInLightTheme = '#e1e3e6'
const chartStrokeColorInDarkTheme = '#353a45'

type IProps = {
  dailyPomodoros: DailyPomodoro[]
  displayTermType: DisplayTermType
  timesGoBack: number
}

const HistoryChart: React.FC<IProps> = ({
  dailyPomodoros,
  displayTermType,
  timesGoBack
}) => {
  const [displayData, setDisplayData] = useState<HistoryDataSet>([])
  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    if (displayTermType === 'week') {
      const paddedDays = paddingUnfocusedDaysOfWeek(dailyPomodoros)
      setDisplayData(paddedDays)
    } else if (displayTermType === 'month') {
      const paddedDays = paddingUnfocusedDaysOfMonth(dailyPomodoros)
      setDisplayData(paddedDays)
    } else {
      const paddedMonths = paddingUnfocusedMonths(dailyPomodoros)
      setDisplayData(paddedMonths)
    }
  }, [displayTermType, timesGoBack])

  const paddingUnfocusedMonths = (
    dailyPomodoros: DailyPomodoro[]
  ): HistoryDataSet => {
    const paddedMonths: HistoryDataSet = []
    const numberMonthsOfYear = 12
    const targetDay = dayjs().subtract(timesGoBack, 'year')
    const daysOfThisYear = dailyPomodoros.filter(
      (obj) => obj.year === targetDay.year()
    )
    let monthlyTotalFocused: DailyPomodoro[] = []
    monthlyTotalFocused = daysOfThisYear.reduce((result, current) => {
      const element = result.find((p) => p.month === current.month)
      if (element != null) {
        element.count += current.count
      } else {
        result.push({
          year: current.year,
          month: current.month,
          day: current.day,
          count: current.count
        })
      }
      return result
    }, monthlyTotalFocused)

    const focusedMonths = monthlyTotalFocused.map((obj) => {
      return obj.month
    })

    for (let i = 1; i <= numberMonthsOfYear; i++) {
      const index = focusedMonths.indexOf(i)
      if (index !== -1) {
        paddedMonths.push({
          name: String(monthlyTotalFocused[index].month),
          count: monthlyTotalFocused[index].count
        })
        continue
      }
      paddedMonths.push({
        name: String(i),
        count: 0
      })
    }
    return paddedMonths
  }

  const paddingUnfocusedDaysOfWeek = (
    dailyPomodoros: DailyPomodoro[]
  ): HistoryDataSet => {
    const historyDataSet: HistoryDataSet = []
    const numberDaysOfWeek = 7
    const targetDay = dayjs().subtract(timesGoBack, 'week')
    // TODO: 月を跨ぐとバグる？
    const lastMonth = dailyPomodoros.filter(
      (obj) =>
        obj.year === targetDay.year() && obj.month === targetDay.month() + 1
    )
    const lastDaysOfMonth = lastMonth.map((obj) => {
      return obj.day
    })
    const day = targetDay.day()
    for (let i = 0; i < numberDaysOfWeek; i++) {
      const targetDate = targetDay.subtract(day - i, 'd').date()
      const index = lastDaysOfMonth.indexOf(targetDate)
      if (index !== -1) {
        historyDataSet.push({
          name: String(lastMonth[index].day),
          count: lastMonth[index].count
        })
        continue
      }
      historyDataSet.push({
        name: String(targetDay.add(i - day, 'day').date()),
        count: 0
      })
    }
    return historyDataSet
  }

  const paddingUnfocusedDaysOfMonth = (
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

  if (!displayData) return <LoadingSpinner />

  return (
    <div className="my-5">
      <ResponsiveContainer width={400} height={200}>
        <BarChart
          data={displayData}
          margin={{ top: 0, left: 0, bottom: 0, right: 40 }}
        >
          <CartesianGrid
            stroke={
              theme === 'dark'
                ? chartStrokeColorInDarkTheme
                : chartStrokeColorInLightTheme
            }
            vertical={false}
          />
          <XAxis dataKey="name" />
          <YAxis width={30} axisLine={false} tickLine={false} />
          <Bar
            type="monotone"
            dataKey="count"
            stroke={COLOR.primary}
            fill={COLOR.primary}
            isAnimationActive={false}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={divStyle}
            labelStyle={pStyle}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HistoryChart
