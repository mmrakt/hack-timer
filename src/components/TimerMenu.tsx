import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Message, Phase } from '../types'
import { FromPopupMessageType } from '../utils/message'
import Circle from './svg/Circle'
import Forward from './svg/Forward'
import Pause from './svg/Pause'
import Play from './svg/Play'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Countdown from './timer/Countdown'
import { DEFAULT_TIMER_SECONDS } from '../consts/index'

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
    useState<number>(0)
  const [pomodorosUntilLongBreak, setpomodorosUntilLongBreak] =
    useState<number>(props.pomodorosUntilLongBreak)
  const [isRunning, setIsRunning] = useState<boolean>(props.isRunning)

  useEffect(() => {
    setDuration(getDuration(phase))
    chrome.runtime.onMessage.addListener((message: Message) => {
      if (message.type === 'reduce-count') {
        setReminingSeconds(message.data.secs)
      } else if (message.type === 'expire') {
        setPhase(message.data.phase)
        setDuration(getDuration(message.data.phase))
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
  }, [])

  const getDuration = (phase: Phase): number => {
    switch (phase) {
      case 'focus':
        return DEFAULT_TIMER_SECONDS.focus
      case 'break':
        return DEFAULT_TIMER_SECONDS.break
      case 'longBreak':
        return DEFAULT_TIMER_SECONDS.longBreak
    }
  }

  const expire = (): void => {
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

  const PomodoroCircles: React.FC = () => {
    const circles = []
    for (let i = 0; i < pomodorosUntilLongBreak; i++) {
      if (i < totalPomodoroCountInSession) {
        circles.push(<Circle fillColor="rgb(244 244 245" />)
      } else {
        circles.push(<Circle fillColor="rgb(24 24 27" />)
      }
    }
    return <>{circles}</>
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
    <div className="m-4">
      <p className="text-center">{getCurrentPhaseText()}</p>
      {duration !== 0 && reminingSeconds !== 0 && (
        <div className="mt-3 flex justify-center">
          <CountdownCircleTimer
            isPlaying={isRunning}
            duration={duration}
            initialRemainingTime={reminingSeconds}
            isSmoothColorTransition
            colors={'rgba(251, 191, 36)'}
            trailColor={'rgb(63 63 70)'}
          >
            {({ remainingTime }) => (
              <Countdown reminingSeconds={remainingTime} />
            )}
          </CountdownCircleTimer>
        </div>
      )}
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
        <PomodoroCircles />
      </div>
      <div className="text-center text-base mt-3"></div>
      <div className="flex gap-3 items-center mt-5">
        <span>{totalPomodoroCountMessge}</span>
        <button
          className="ml-auto text-lg border-2 border-gray-200 px-1 rounded-md  hover:border-gray-300 hover:text-gray-300"
          onClick={expire}
        >
          <Forward />
        </button>
      </div>
    </div>
  )
}

export default TimerMenu
