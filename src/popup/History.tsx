import { useState, useEffect } from 'react'
import ArrowLeft from '../components/svg/ArrowLeft'
import { DisplayTermType, DailyPomodoro, DataSet } from '../types/index'
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
import { getStorage } from '../utils/chrome'
import ja from 'dayjs/locale/ja'
import ChevronLeft from '../components/svg/ChevronLeft'
import ChevronRight from '../components/svg/ChevronRight'

dayjs.locale(ja)

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
  const [displayTermType, setDisplayTermType] =
    useState<DisplayTermType>('week')
  const [targetTermString, setTargetTermString] = useState<string>('')
  const termTypes: DisplayTermType[] = ['week', 'month', 'year']

  useEffect(() => {
    setTargetTermString(formatTargetTermString)
    const testValue = testData
    getStorage(['dailyPomodoros']).then((data) => {
      if (displayTermType === 'week') {
        const paddedDays = paddingUnfocusedDaysOfWeek(testValue)
        setDisplayData(paddedDays)
      } else if (displayTermType === 'month') {
        const paddedDays = paddingUnfocusedDaysOfMonth(testValue)
        setDisplayData(paddedDays)
      } else {
        const paddedMonths = paddingUnfocusedMonths(testValue)
        setDisplayData(paddedMonths)
      }
    })
  }, [displayTermType])

  const formatTargetTermString = (): string => {
    switch (displayTermType) {
      case 'week':
        // TODO: 月曜始まりに直す
        return (
          dayjs().startOf('week').format('YYYY/MM/DD') +
          ' ~ ' +
          dayjs().endOf('week').format('YYYY/MM/DD')
        )
      case 'month':
        return dayjs().format('YYYY/MM')
      case 'year':
        return dayjs().format('YYYY')
    }
  }

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
      <div className="mt-3 w-5/6 mx-auto">
        <div className="flex bg-zinc-800 border-zinc-600 border-[1px] rounded-lg p-1">
          {termTypes.map((term) => (
            <button
              key={term}
              className={`${
                displayTermType === term ? 'bg-zinc-700' : ''
              } px-2 py-1 rounded-md flex-grow`}
              onClick={() => {
                setDisplayTermType(term)
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
        <div className="flex justify-between items-center mt-3 text-base">
          <span className="">
            <ChevronLeft />
          </span>
          {targetTermString}
          <span className="">
            <ChevronRight />
          </span>
        </div>
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
              <XAxis dataKey="name" />
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
