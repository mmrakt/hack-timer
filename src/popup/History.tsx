import { useState, useEffect } from 'react'
import ArrowLeft from '../components/svg/ArrowLeft'
import { DisplayTerm, DailyPomodoro, DataSet } from '../types/index'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import LoadingSpinner from '../components/LoadingSpinner'
import { testData } from '../utils/testDate'
import dayjs from 'dayjs'
import EllipsisHorizontal from '../components/svg/EllipsisHorizontal'
import Dropdown from '../components/Dropdown'
import { DropdownMenu } from '../components/history/DropdownMenu'

const pStyle = {
  color: '#f4f4f4'
}

const divStyle = {
  background: '#181818',
  opacity: 0.9,
  fontWeight: 'bold',
  border: 'solid 1px #353a45'
}

const History: React.FC<{ handleDisplayTimer: () => void }> = ({
  handleDisplayTimer
}) => {
  const [displayData, setDisplayData] = useState<DataSet>([])
  const [displayTerm, setDisplayTerm] = useState<DisplayTerm>('week')
  const terms: DisplayTerm[] = ['week', 'month', 'year']

  useEffect(() => {
    const testValue = testData
    chrome.runtime.sendMessage(
      'displayHistory',
      ({ dailyPomodoros: value }: { dailyPomodoros: DailyPomodoro[] }) => {
        if (displayTerm === 'week') {
          const paddedDays = paddingUnfocusedDaysOfWeek(testValue)
          setDisplayData(paddedDays)
        } else if (displayTerm === 'month') {
          const paddedDays = paddingUnfocusedDaysOfMonth(testValue)
          setDisplayData(paddedDays)
        } else {
          const paddedMonths = paddingUnfocusedMonths(testValue)
          setDisplayData(paddedMonths)
        }
      }
    )
  }, [displayTerm])

  const paddingUnfocusedMonths = (dailyPomodoros: DailyPomodoro[]): DataSet => {
    const paddedMonths: DataSet = []
    const numberMonthsOfYear = 12
    const today = dayjs()
    const month = today.month() + 1
    const daysOfThisYear = dailyPomodoros.filter(
      (obj) => obj.year === today.year()
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
      if (i <= month) {
        const index = focusedMonths.indexOf(i)
        if (index !== -1) {
          paddedMonths.push({
            name: String(monthlyTotalFocused[index].month),
            count: monthlyTotalFocused[index].count
          })
          continue
        }
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
  ): DataSet => {
    const paddedDays: DataSet = []
    const numberDaysOfWeek = 7
    const today = dayjs()
    const lastMonth = dailyPomodoros.filter(
      (obj) => obj.year === today.year() && obj.month === today.month() + 1
    )
    const lastDaysOfMonth = lastMonth.map((obj) => {
      return obj.day
    })
    const day = today.day()
    for (let i = 1; i <= numberDaysOfWeek; i++) {
      const targetDate = today.subtract(day - i, 'd').date()
      if (i <= day) {
        const index = lastDaysOfMonth.indexOf(targetDate)
        if (index !== -1) {
          paddedDays.push({
            name: String(lastMonth[index].day),
            count: lastMonth[index].count
          })
          continue
        }
      }
      paddedDays.push({
        name: String(today.add(i - day, 'day').date()),
        count: 0
      })
    }
    return paddedDays
  }

  const paddingUnfocusedDaysOfMonth = (
    dailyPomodoros: DailyPomodoro[]
  ): DataSet => {
    const paddedDays: DataSet = []
    const today = dayjs()
    const endOfDate = today.endOf('month').date()
    const lastMonth = dailyPomodoros.filter(
      (obj) => obj.year === today.year() && obj.month === today.month() + 1
    )
    const lastDaysOfMonth = lastMonth.map((obj) => {
      return obj.day
    })

    for (let i = 1; i <= endOfDate; i++) {
      if (i <= today.date()) {
        const index = lastDaysOfMonth.indexOf(i)
        if (index !== -1) {
          paddedDays.push({
            name:
              String(today.month() + 1) + '/' + String(lastMonth[index].day),
            count: lastMonth[index].count
          })
          continue
        }
      }
      paddedDays.push({
        name: String(today.month() + 1) + '/' + String(i),
        count: 0
      })
    }
    return paddedDays
  }

  return (
    <>
      <div className="flex display-start mt-3 mx-3">
        <ArrowLeft handleClick={handleDisplayTimer} />
        <span className="ml-auto">
          <Dropdown target={<EllipsisHorizontal />} menu={<DropdownMenu />} />
        </span>
      </div>
      <div className="mt-3 w-5/6 mx-auto flex bg-zinc-800 border-zinc-600 border-[1px] rounded-lg p-1">
        {terms.map((term) => (
          <button
            key={term}
            className={`${
              displayTerm === term ? 'bg-zinc-700' : ''
            } px-2 py-1 rounded-md flex-grow`}
            onClick={() => {
              setDisplayTerm(term)
            }}
          >
            {term === 'week'
              ? 'Weekly'
              : term === 'month'
              ? 'Monthly'
              : 'Yearly'}
          </button>
        ))}
      </div>
      {displayData.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="my-5">
          <ResponsiveContainer width={500} height={200}>
            <BarChart
              data={displayData}
              margin={{ top: 0, left: 0, bottom: 0, right: 40 }}
            >
              <CartesianGrid stroke="#353a45" strokeDasharray="3 3" />
              <XAxis dataKey="name" label="name" />
              <YAxis />
              <Bar
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                fill="#8884d8"
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
      )}
    </>
  )
}

export default History
