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
  reminingSeconds: number
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
    const { minutes, seconds } = getTimeFromSeconds(props.reminingSeconds)
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

  const totalPomodoroCountMessge = t('popup.totalPomodoroCount').replace(
    '%f',
    String(todayTotalPomodoroCount)
  )

  return (
    <div className="h-[50rem] p-40">
      <CurrentPhase inPopup={false} />
      <div className="mt-5 flex justify-center">
        <span className="text-7xl">{formatedDisplayTime}</span>
      </div>
      <div className="mt-5 flex justify-center">
        <button onClick={onStartBreak}>
          <Play className="h-20 w-20" />
        </button>
      </div>
      <div className="mt-5 flex justify-center gap-2">
        <PomodoroCircles
          pomodorosUntilLongBreak={pomodorosUntilLongBreak}
          totalPomodoroCountInSession={totalPomodoroCountsInSession}
        />
      </div>
      <div className="mt-5 flex items-center justify-center text-lg">
        <span>{totalPomodoroCountMessge}</span>
      </div>
    </div>
  )
}
const ExpireContainer: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('focus')
  const [reminingSeconds, setReminingSeconds] = useState<number>(0)
  const [todayTotalPomodoroCount, setTodayTotalPomodoroCount] =
    useState<number>(0)
  const [totalPomodoroCountsInSession, setTotalPomodoroCountsInSession] =
    useState<number>(0)
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] =
    useState<number>(0)

  useEffect(() => {
    getStorage([
      'phase',
      'reminingSeconds',
      'dailyPomodoros',
      'totalPomodoroCountsInSession',
      'pomodorosUntilLongBreak'
    ]).then((value: StorageValue) => {
      setPhase(value.phase)
      setReminingSeconds(value.reminingSeconds)
      setTodayTotalPomodoroCount(
        extractTodayPomodoroCount(value.dailyPomodoros)
      )
      setTotalPomodoroCountsInSession(value.totalPomodoroCountsInSession)
      setPomodorosUntilLongBreak(value.pomodorosUntilLongBreak)
    })
  }, [])

  if (reminingSeconds === 0 || pomodorosUntilLongBreak === 0) {
    return <LoadingSpinner />
  }

  return (
    <ThemeProvider>
      <div className="base-bg-color text-color">
        <ExpireMenu
          phase={phase}
          reminingSeconds={reminingSeconds}
          todayTotalPomodoroCount={todayTotalPomodoroCount}
          totalPomodoroCountsInSession={totalPomodoroCountsInSession}
          pomodorosUntilLongBreak={pomodorosUntilLongBreak}
        />
      </div>
    </ThemeProvider>
  )
}

export { ExpireMenu, ExpireContainer }
