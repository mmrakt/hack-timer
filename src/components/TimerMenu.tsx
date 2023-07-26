import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Message, Phase } from '../types'
import { FromPopupMessageType } from '../utils/message'
import Forward from './svg/Forward'
import { ColorFormat, CountdownCircleTimer } from 'react-countdown-circle-timer'
import Countdown from './timer/Countdown'
import { COLOR } from '../consts/color'
import { getStorage } from '../utils/chrome'
import PomodoroCircles from './timer/PomodoroCircles'
import { ThemeContext } from './ThemeProvider'
import { closeTabs } from '../background/Tab'
import { CurrentPhaseContext } from './CurrentPhaseContextProvider'

type IProps = {
  reminingSeconds: number
  isRunning: boolean
  todayTotalPomodoroCount: number
  totalPomodoroCountInSession: number
  pomodorosUntilLongBreak: number
}

const TimerMenu: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
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
  const { currentPhase, setCurrentPhase } = useContext(CurrentPhaseContext)

  useEffect(() => {
    ;(async () => {
      setDuration(await getDuration(currentPhase))
      chrome.runtime.onMessage.addListener(async (message: Message) => {
        if (message.type === 'reduce-count') {
          setReminingSeconds(message.data.secs)
        } else if (message.type === 'expire') {
          setCurrentPhase(message.data.phase)
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

  // NOTE: 引数にphaseを渡さなくても取れるが、前回のphaseを参照してしまうため渡している
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
    closeTabs()
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

  const getCircleColor = (): string => {
    switch (currentPhase) {
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
    <div id="timerMenu">
      <div className="mt-5 flex justify-center ">
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
              <Countdown
                reminingSeconds={remainingTime}
                isRunning={isRunning}
                onToggleStatus={() => {
                  isRunning ? pause() : resume()
                }}
              />
            )}
          </CountdownCircleTimer>
        )}
      </div>

      <div className="flex justify-between items-center mt-5 text-sm">
        <span>{totalPomodoroCountMessge}</span>
        <div className="flex justify-center gap-1">
          <PomodoroCircles
            pomodorosUntilLongBreak={pomodorosUntilLongBreak}
            totalPomodoroCountInSession={totalPomodoroCountInSession}
          />
        </div>
        <button
          className="ml-4 text-lg px-1 rounded-md hover:text-gray-300"
          onClick={expire}
        >
          <Forward />
        </button>
      </div>
    </div>
  )
}

export default TimerMenu
