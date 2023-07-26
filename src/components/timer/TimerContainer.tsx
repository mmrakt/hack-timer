import { useState, useEffect } from 'react'
import LoadingSpinner from '../LoadingSpinner'
import { StorageValue } from '../../types'
import { getStorage } from '../../utils/chrome'
import { extractTodayPomodoroCount } from '../../utils/pomodoroHelper'
import Header from './Header'
import TimerMenu from '../TimerMenu'

const Timer: React.FC = () => {
  const [reminingSeconds, setReminingSeconds] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [todayTotalPomodoroCount, setTodayTotalPomodoroCount] =
    useState<number>(0)
  const [totalPomodoroCountInSession, setTotalPomodoroCountInSession] =
    useState<number>(0)
  const [pomodorosUntilLongBreak, setpomodorosUntilLongBreak] =
    useState<number>(0)

  useEffect(() => {
    getStorage([
      'reminingSeconds',
      'isRunning',
      'dailyPomodoros',
      'totalPomodoroCountsInSession',
      'pomodorosUntilLongBreak'
    ]).then((value: StorageValue) => {
      setReminingSeconds(value.reminingSeconds)
      setIsRunning(value.isRunning)
      setTodayTotalPomodoroCount(
        extractTodayPomodoroCount(value.dailyPomodoros)
      )
      setTotalPomodoroCountInSession(value.totalPomodoroCountsInSession)
      setpomodorosUntilLongBreak(value.pomodorosUntilLongBreak)
    })
  }, [])
  return (
    <div id="timer">
      <Header />
      {!reminingSeconds || pomodorosUntilLongBreak === 0 ? (
        <div className="w-full h-[22rem] flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <TimerMenu
          reminingSeconds={reminingSeconds}
          isRunning={isRunning}
          totalPomodoroCountInSession={totalPomodoroCountInSession}
          todayTotalPomodoroCount={todayTotalPomodoroCount}
          pomodorosUntilLongBreak={pomodorosUntilLongBreak}
        />
      )}
    </div>
  )
}

export default Timer
