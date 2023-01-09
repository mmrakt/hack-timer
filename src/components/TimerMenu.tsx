import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Message } from '../types'
import { FromPopupMessageType } from '../utils/message'
import { getTimeFromSeconds } from '../utils/timeHelper'
import Digit from './Degit'
import Circle from './svg/Circle'
import Forward from './svg/Forward'
import Pause from './svg/Pause'
import Play from './svg/Play'

type IProps = {
  reminingSeconds: number
  isRunning: boolean
  todayTotalPomodoroCount: number
  totalPomodoroCountInSession: number
  pomodoroCountUntilLongBreak: number
}

const TimerMenu: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const [seconds, setSeconds] = useState<number>(props.reminingSeconds)
  const [todayTotalPomodoroCount, setTodayTotalPomodoroCount] =
    useState<number>(props.todayTotalPomodoroCount)
  const [totalPomodoroCountInSession, setTotalPomodoroCountInSession] =
    useState<number>(0)
  const [pomodoroCountUntilLongBreak, setPomodoroCountUntilLongBreak] =
    useState<number>(props.pomodoroCountUntilLongBreak)
  const [isRunning, setIsRunning] = useState<boolean>(props.isRunning)
  const { seconds: displaySeconds, minutes: displayMinutes } =
    getTimeFromSeconds(seconds)

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message: Message) => {
      if (message.type === 'reduce-count') {
        setSeconds(message.data.secs)
      } else if (message.type === 'expire') {
        setSeconds(message.data.secs)
        setIsRunning(false)
        setTodayTotalPomodoroCount(message.data.todayTotalPomodoroCount)
        setTotalPomodoroCountInSession(
          message.data.totalPomodoroCountsInSession
        )
        setPomodoroCountUntilLongBreak(message.data.pomodoroCountUntilLongBreak)
      } else if (message.type === 'toggle-timer-status') {
        setIsRunning(message.data.toggledTimerStatus)
      }
    })
  }, [])

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
    for (let i = 0; i < pomodoroCountUntilLongBreak; i++) {
      if (i < totalPomodoroCountInSession) {
        circles.push(<Circle fillColor="rgb(244 244 245" />)
      } else {
        circles.push(<Circle fillColor="rgb(24 24 27" />)
      }
    }
    return <>{circles}</>
  }

  const totalPomodoroCountMessge = t('popup.totalPomodoroCount').replace(
    '%f',
    String(todayTotalPomodoroCount)
  )

  return (
    <div className="m-4">
      <div className="mt-3 text-5xl w-32 font-extralight mx-auto">
        <Digit count={displayMinutes} />:
        <Digit count={displaySeconds} />
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
