import React, { useEffect, useState } from 'react'
import { getStorage } from '../utils/chrome'
import { Message, Phase, StorageValue } from '../types/index'
import { useTranslation } from 'react-i18next'
import { FromPopupMessageType } from '../utils/message'
import ThemeProvider from '../components/ThemeProvider'
import LoadingSpinner from '../components/LoadingSpinner'
import Play from '../components/svg/Play'
import PomodoroCircles from '../components/timer/PomodoroCircles'
import { formatDisplayTime, getTimeFromSeconds } from '../utils/timeHelper'
import { extractTodayPomodoroCount } from '../utils/pomodoroHelper'

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

  const getCurrentPhaseText = (): string => {
    switch (phase) {
      case 'focus':
        return t('common.pomodoro')
      case 'break':
        return t('common.break')
      case 'longBreak':
        return t('common.longBreak')
    }
  }

  const totalPomodoroCountMessge = t('popup.totalPomodoroCount').replace(
    '%f',
    String(todayTotalPomodoroCount)
  )

  return (
    <div className="h-[50rem] p-40">
      <p className="text-center text-lg">{getCurrentPhaseText()}</p>
      <div className="mt-5 flex justify-center">
        <span className="text-7xl">{formatedDisplayTime}</span>
      </div>
      <div className="flex justify-center mt-5">
        <button onClick={onStartBreak}>
          <Play className="h-20 w-20" />
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-5">
        <PomodoroCircles
          pomodorosUntilLongBreak={pomodorosUntilLongBreak}
          totalPomodoroCountInSession={totalPomodoroCountsInSession}
        />
      </div>
      <div className="text-center text-base mt-3"></div>
      <div className="flex items-center justify-center mt-10 text-lg">
        <span>{totalPomodoroCountMessge}</span>
        {/* <button
          className="ml-auto text-lg px-1 rounded-md hover:text-gray-300"
          onClick={expire}
        >
          <Forward />
        </button> */}
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
      <div className="base-color text-color">
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
