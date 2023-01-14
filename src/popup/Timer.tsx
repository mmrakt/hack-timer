import { useState, useEffect } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import Header from '../components/timer/HeaderMenu'
import TimerMenu from '../components/TimerMenu'
import { Phase, StorageValue } from '../types'
import { getStorage } from '../utils/chrome'
import { extractTodayPomodoroCount } from '../utils/timeHelper'

const TimerContainer: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('focus')
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
      'phase',
      'reminingSeconds',
      'isRunning',
      'dailyPomodoros',
      'totalPomodoroCountsInSession',
      'pomodoroCountUntilLongBreak'
    ]).then((value: StorageValue) => {
      setPhase(value.phase)
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
          phase={phase}
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
