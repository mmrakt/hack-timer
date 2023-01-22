import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Message, Phase } from '../types'
import { FromPopupMessageType } from '../utils/message'
import Forward from './svg/Forward'
import Pause from './svg/Pause'
import Play from './svg/Play'
import { ColorFormat, CountdownCircleTimer } from 'react-countdown-circle-timer'
import Countdown from './timer/Countdown'
import { COLOR } from '../consts/color'
import { getStorage } from '../utils/chrome'
import PomodoroCircles from './timer/PomodoroCircles'
import { ThemeContext } from '../popup/Popup'

type IProps = {
  phase: Phase
  reminingSeconds: number
  isRunning: boolean
  todayTotalPomodoroCount: number
  totalPomodoroCountInSession: number
  pomodorosUntilLongBreak: number
}

const TimerMenu: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<Phase>(props.phase)
  const [duration, setDuration] = useState<number>(0)
  const [reminingSeconds, setReminingSeconds] = useState<number>(
    props.reminingSeconds
  )
  const [todayTotalPomodoroCount, setTodayTotalPomodoroCount] =
    useState<number>(props.todayTotalPomodoroCount)
  const [totalPomodoroCountInSession, setTotalPomodoroCountInSession] =
    useState<number>(props.totalPomodoroCountInSession)
  const [pomodorosUntilLongBreak, setpomodorosUntilLongBreak] =
    useState<number>(props.pomodorosUntilLongBreak)
  const [isRunning, setIsRunning] = useState<boolean>(props.isRunning)
  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    ;(async () => {
      setDuration(await getDuration(phase))
      chrome.runtime.onMessage.addListener(async (message: Message) => {
        if (message.type === 'reduce-count') {
          setReminingSeconds(message.data.secs)
        } else if (message.type === 'expire') {
          setPhase(message.data.phase)
          setDuration(await getDuration(message.data.phase))
          setReminingSeconds(message.data.secs)
          setIsRunning(false)
          setTodayTotalPomodoroCount(message.data.todayTotalPomodoroCount)
          setTotalPomodoroCountInSession(
            message.data.totalPomodoroCountsInSession
          )
          setpomodorosUntilLongBreak(message.data.pomodorosUntilLongBreak)
        } else if (message.type === 'toggle-timer-status') {
          setIsRunning(message.data.toggledTimerStatus)
        }
      })
    })()
  }, [])

  const getDuration = async (phase: Phase): Promise<number> => {
    switch (phase) {
      case 'focus':
        return (await getStorage(['pomodoroSeconds'])).pomodoroSeconds
      case 'break':
        return (await getStorage(['breakSeconds'])).breakSeconds
      case 'longBreak':
        return (await getStorage(['longBreakSeconds'])).longBreakSeconds
    }
  }

  const expire = (): void => {
    setReminingSeconds(0)
    chrome.runtime.sendMessage<Message>({ type: FromPopupMessageType.EXPIRE })
  }
  const pause = (): void => {
    chrome.runtime.sendMessage<Message>(
      { type: FromPopupMessageType.PAUSE },
      async () => {
        setIsRunning(false)
      }
    )
  }
  const resume = (): void => {
    chrome.runtime.sendMessage<Message>(
      { type: FromPopupMessageType.RESUME },
      async () => {
        setIsRunning(true)
      }
    )
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

  const getCircleColor = (): string => {
    switch (phase) {
      case 'focus':
        return COLOR.primary
      case 'break':
        return COLOR.secondary
      case 'longBreak':
        return COLOR.secondary
    }
  }

  const totalPomodoroCountMessge = t('popup.totalPomodoroCount').replace(
    '%f',
    String(todayTotalPomodoroCount)
  )

  return (
    <div className="m-4">
      <p className="text-center text-sm">{getCurrentPhaseText()}</p>
      <div className="mt-5 flex justify-center h-44">
        {duration !== 0 && reminingSeconds !== 0 && (
          <CountdownCircleTimer
            isPlaying={isRunning}
            duration={duration}
            initialRemainingTime={reminingSeconds}
            isSmoothColorTransition
            colors={getCircleColor() as ColorFormat}
            trailColor={
              theme === 'dark'
                ? (COLOR.circleTrail.dark as ColorFormat)
                : (COLOR.circleTrail.light as ColorFormat)
            }
          >
            {({ remainingTime }) => (
              <Countdown reminingSeconds={remainingTime} />
            )}
          </CountdownCircleTimer>
        )}
      </div>
      <div className="flex justify-center mt-3">
        {isRunning ? (
          <button onClick={pause}>
            <Pause />
          </button>
        ) : (
          <button onClick={resume}>
            <Play />
          </button>
        )}
      </div>
      <div className="flex justify-center gap-2 mt-3">
        <PomodoroCircles
          pomodorosUntilLongBreak={pomodorosUntilLongBreak}
          totalPomodoroCountInSession={totalPomodoroCountInSession}
        />
      </div>
      <div className="text-center text-base mt-3"></div>
      <div className="flex gap-3 items-center mt-5 text-sm">
        <span>{totalPomodoroCountMessge}</span>
        <button
          className="ml-auto text-lg px-1 rounded-md hover:text-gray-300"
          onClick={expire}
        >
          <Forward />
        </button>
      </div>
    </div>
  )
}

export default TimerMenu
