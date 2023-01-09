import { useState, useEffect } from 'react'
import Header from '../components/timer/Header'
import TimerMenu from '../components/TimerMenu'
import { StorageValue } from '../types'
import { getStorage } from '../utils/chrome'
import { extractTodayPomodoroCount } from '../utils/timeHelper'

const TimerContainer: React.FC = () => {
  const [reminingSeconds, setReminingSeconds] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [todayTotalPomodoroCount, setTodayTotalPomodoroCount] =
    useState<number>(0)
  const [totalPomodoroCountInSession, setTotalPomodoroCountInSession] =
    useState<number>(0)
  const [pomodoroCountUntilLongBreak, setPomodoroCountUntilLongBreak] =
    useState<number>(0)

  useEffect(() => {
    getStorage([
      'reminingSeconds',
      'isRunning',
      'dailyPomodoros',
      'totalPomodoroCountsInSession',
      'pomodoroCountUntilLongBreak'
    ]).then((value: StorageValue) => {
      setReminingSeconds(value.reminingSeconds)
      setIsRunning(value.isRunning)
      setTodayTotalPomodoroCount(
        extractTodayPomodoroCount(value.dailyPomodoros)
      )
      setTotalPomodoroCountInSession(value.totalPomodoroCountsInSession)
      setPomodoroCountUntilLongBreak(value.pomodoroCountUntilLongBreak)
    })
  }, [])

  if (!reminingSeconds) return <div>...loading</div>

  return (
    <div className="base-color border-2 border-gray-700 text-color w-[400px]">
      <Header />
      <TimerMenu
        reminingSeconds={reminingSeconds}
        isRunning={isRunning}
        totalPomodoroCountInSession={totalPomodoroCountInSession}
        todayTotalPomodoroCount={todayTotalPomodoroCount}
        pomodoroCountUntilLongBreak={pomodoroCountUntilLongBreak}
      />
    </div>
  )
}

export default TimerContainer
