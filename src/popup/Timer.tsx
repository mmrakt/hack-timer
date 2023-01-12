import { useState, useEffect } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import Header from '../components/timer/HeaderMenu'
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

  return (
    <>
      <Header />
      {!reminingSeconds ? (
        <LoadingSpinner />
      ) : (
        <TimerMenu
          reminingSeconds={reminingSeconds}
          isRunning={isRunning}
          totalPomodoroCountInSession={totalPomodoroCountInSession}
          todayTotalPomodoroCount={todayTotalPomodoroCount}
          pomodoroCountUntilLongBreak={pomodoroCountUntilLongBreak}
        />
      )}
    </>
  )
}

export default TimerContainer
