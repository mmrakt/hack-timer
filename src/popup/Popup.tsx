import { useState, useEffect } from 'react'
import History from './History'
import { PageType, StorageValue, Message } from '../types/index'
import Chart from '../components/svg/Chart'
import Pause from '../components/svg/Pause'
import Play from '../components/svg/Play'
import Digit from '../components/Degit'
import '../styles/globals.css'
import {
  extractTodayPomodoroCount,
  getTimeFromSeconds
} from '../utils/timeHelper'
import Cogwheel from '../components/svg/Cogwheel'
import Settings from './Settings'
import { getStorage } from '../utils/chrome'
import { useTranslation } from 'react-i18next'
import Forward from '../components/svg/Forward'
import Circle from '../components/svg/Circle'
import { FromPopupMessageType } from '../utils/message'

interface IProps {
  reminingSeconds: number
  isRunning: boolean
  todayTotalPomodoroCount: number
  totalPomodoroCountInSession: number
  pomodoroCountUntilLongBreak: number
}

const Timer: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const [isDisplayPage, setIsDisplayPage] = useState<PageType>('timer')
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

  const onDisplayHistory = (): void => {
    setIsDisplayPage('history')
  }

  const onDisplayTimer = (): void => {
    setIsDisplayPage('timer')
  }

  const onDisplaySettigns = (): void => {
    setIsDisplayPage('settings')
  }

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

  switch (isDisplayPage) {
    case 'timer':
      return (
        <div className="w-48 m-4">
          <div className="flex gap-3">
            <button className="" onClick={onDisplayHistory}>
              <Chart />
            </button>
            <button className="" onClick={onDisplaySettigns}>
              <Cogwheel />
            </button>
          </div>
          <div className="mt-3 text-5xl w-32 mx-auto">
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
    case 'history':
      return <History handleDisplayTimer={onDisplayTimer} />
    case 'settings':
      return <Settings handleDisplayTimer={onDisplayTimer} />
  }
}

const Popup: React.FC = () => {
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

  if (!reminingSeconds) return <div>...loading</div>

  return (
    <div className="base-color border-2 border-gray-700 text-color">
      <Timer
        reminingSeconds={reminingSeconds}
        isRunning={isRunning}
        totalPomodoroCountInSession={totalPomodoroCountInSession}
        todayTotalPomodoroCount={todayTotalPomodoroCount}
        pomodoroCountUntilLongBreak={pomodoroCountUntilLongBreak}
      />
    </div>
  )
}

export default Popup
