import React, { useEffect, useState } from 'react'
import { getStorage } from '../utils/chrome'
import { Message, Phase, StorageValue } from '../types/index'
import { useTranslation } from 'react-i18next'
import { FromPopupMessageType } from '../utils/message'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Play from '../components/common/Play'
import PomodoroCircles from '../features/timer/PomodoroCircles'
import { formatDisplayTime, getTimeFromSeconds } from '../utils/timeHelper'
import { extractTodayPomodoroCount } from '../utils/pomodoroHelper'
import CurrentPhase from '../features/timer/CurrentPhase'
import ThemeProvider from '../providers/ThemeProvider'

type IProps = {
  phase: Phase
  remainingSeconds: number
  todayTotalPomodoroCount: number
  totalPomodoroCountsInSession: number
  pomodorosUntilLongBreak: number
}

const ExpireMenu: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const [phase] = useState<Phase>(props.phase)
  const [formatedDisplayTime, setFormatedDisplayTime] = useState<string>('')
  const [todayTotalPomodoroCount] = useState<number>(
    props.todayTotalPomodoroCount
  )
  const [totalPomodoroCountsInSession] = useState<number>(
    props.totalPomodoroCountsInSession
  )
  const [pomodorosUntilLongBreak] = useState<number>(
    props.pomodorosUntilLongBreak
  )

  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown)
    const { minutes, seconds } = getTimeFromSeconds(props.remainingSeconds)
    setFormatedDisplayTime(formatDisplayTime(seconds, minutes))

    return () => {
      document.body.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const onStartBreak = async (): Promise<void> => {
    await chrome.runtime.sendMessage<Message>({
      type: FromPopupMessageType.RESUME
    })
    const queryOptions = { active: true, lastFocusedWindow: true }
    await chrome.tabs.query(queryOptions, async ([result]) => {
      if (result.id) {
        await chrome.tabs.remove(result.id)
      }
    })
  }

  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      onStartBreak()
    }
  }

  const totalPomodoroCountMessage = t('popup.totalPomodoroCount').replace(
    '%f',
    String(todayTotalPomodoroCount)
  )

  return (
    <div className="h-screen p-40">
      <div className="flex justify-center">
        <CurrentPhase inPopup={false} />
      </div>
      <div className="mt-5 flex justify-center">
        <span className="text-7xl">{formatedDisplayTime}</span>
      </div>
      <div className="mt-5 flex justify-center">
        <button onClick={onStartBreak}>
          <Play className="h-16 w-16" />
        </button>
      </div>
      <div className="mt-5 flex justify-center gap-2">
        <PomodoroCircles
          pomodorosUntilLongBreak={pomodorosUntilLongBreak}
          totalPomodoroCountInSession={totalPomodoroCountsInSession}
          className="h-4 w-4"
        />
      </div>
      <div className="mt-5 flex items-center justify-center text-xl">
        <span>{totalPomodoroCountMessage}</span>
      </div>
    </div>
  )
}
const ExpireContainer: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('focus')
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
  const [todayTotalPomodoroCount, setTodayTotalPomodoroCount] =
    useState<number>(0)
  const [totalPomodoroCountsInSession, setTotalPomodoroCountsInSession] =
    useState<number>(0)
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] =
    useState<number>(0)

  useEffect(() => {
    getStorage([
      'phase',
      'remainingSeconds',
      'dailyPomodoros',
      'totalPomodoroCountsInSession',
      'pomodorosUntilLongBreak'
    ]).then((value: StorageValue) => {
      setPhase(value.phase)
      setRemainingSeconds(value.remainingSeconds)
      setTodayTotalPomodoroCount(
        extractTodayPomodoroCount(value.dailyPomodoros)
      )
      setTotalPomodoroCountsInSession(value.totalPomodoroCountsInSession)
      setPomodorosUntilLongBreak(value.pomodorosUntilLongBreak)
    })
  }, [])

  if (remainingSeconds === 0 || pomodorosUntilLongBreak === 0) {
    return <LoadingSpinner />
  }

  return (
    <ThemeProvider>
      <div className="base-bg-color text-color">
        <ExpireMenu
          phase={phase}
          remainingSeconds={remainingSeconds}
          todayTotalPomodoroCount={todayTotalPomodoroCount}
          totalPomodoroCountsInSession={totalPomodoroCountsInSession}
          pomodorosUntilLongBreak={pomodorosUntilLongBreak}
        />
      </div>
    </ThemeProvider>
  )
}

export { ExpireMenu, ExpireContainer }
