import { useContext } from 'react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { HistoryDataSet } from '@/types'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { COLOR } from '@/consts/color'
import { ThemeContext } from '@/providers/ThemeProvider'

const tooltipLabelStyle = {
  light: {
    color: COLOR.gray[950]
  },
  dark: {
    color: COLOR.gray[50]
  }
}

const tooltipContentStyle = {
  light: {
    background: COLOR.gray[50],
    opacity: 0.9,
    fontWeight: 'bold'
  },
  dark: {
    background: COLOR.gray[950],
    opacity: 0.9,
    fontWeight: 'bold',
    border: `solid 1px ${COLOR.gray[500]}`
  }
}

const chartStrokeColor = {
  light: '#e1e3e6',
  dark: '#353a45'
}

type IProps = {
  historyData: HistoryDataSet
}

const HistoryChart: React.FC<IProps> = ({ historyData }) => {
  const { theme } = useContext(ThemeContext)

  if (!historyData) return <LoadingSpinner />

  return (
    <div className="my-5">
      <ResponsiveContainer width={400} height={200}>
        <BarChart
          data={historyData}
          margin={{ top: 0, left: 0, bottom: 0, right: 40 }}
        >
          <CartesianGrid
            stroke={
              theme === 'dark' ? chartStrokeColor.dark : chartStrokeColor.light
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
            contentStyle={
              theme === 'dark'
                ? tooltipContentStyle.dark
                : tooltipContentStyle.light
            }
            labelStyle={
              theme === 'dark'
                ? tooltipLabelStyle.dark
                : tooltipLabelStyle.light
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HistoryChart
