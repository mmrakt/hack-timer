import HistoryChart from '../../components/history/HistoryChart'
import { DailyPomodoro, DisplayTermType } from '../../types/index'
describe('', () => {
  beforeEach(() => {})
  afterEach(() => {})
  it('HistoryChart', async () => {
    const dailyPomodoros: DailyPomodoro[] = [
      {
        year: 2022,
        month: 1,
        day: 1,
        count: 10
      },
      {
        year: 2022,
        month: 1,
        day: 2,
        count: 5
      },
      {
        year: 2022,
        month: 2,
        day: 1,
        count: 3
      }
    ]
    const displayTermType: DisplayTermType = 'month'
    const timesGoBack = 0
  })
})
