import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Message, Phase, StorageValue } from '../types'
import { FromPopupMessageType } from '../utils/message'
import FastForward from '../components/common/FastForward'
import { ColorFormat, CountdownCircleTimer } from 'react-countdown-circle-timer'
import Countdown from '../features/timer/Countdown'
import { COLOR } from '../consts/color'
import { getStorage } from '../utils/chrome'
import PomodoroCircles from '../features/timer/PomodoroCircles'
import { closeTabs } from '../background/Tab'
import { CurrentPhaseContext } from '../providers/CurrentPhaseContextProvider'
import { extractTodayPomodoroCount } from '../utils/pomodoroHelper'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Header from '../features/timer/Header'
import { ThemeContext } from '../providers/ThemeProvider'

const Timer: React.FC = (props) => {
  const { t } = useTranslation()
  const [duration, setDuration] = useState<number>(0)
  const [reminingSeconds, setReminingSeconds] = useState<number>(0)
  const [todayTotalPomodoroCount, setTodayTotalPomodoroCount] =
    useState<number>(0)
  const [totalPomodoroCountInSession, setTotalPomodoroCountInSession] =
    useState<number>(0)
  const [pomodorosUntilLongBreak, setpomodorosUntilLongBreak] =
    useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const { theme } = useContext(ThemeContext)
  const { currentPhase, setCurrentPhase } = useContext(CurrentPhaseContext)

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

  useEffect(() => {
    ;(async () => {
      // const fetchedDuration = await getDuration(currentPhase);
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

  console.log(duration)
  console.log(reminingSeconds)

  return (
    <div id="timerMenu">
      <Header />
      {!reminingSeconds ? (
        <div className="flex h-[22rem] w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
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
                  ? (COLOR.gray[600] as ColorFormat)
                  : (COLOR.gray[300] as ColorFormat)
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
      )}

      <div className="mt-5 flex items-center justify-between text-sm">
        <span>{totalPomodoroCountMessge}</span>
        <div className="flex justify-center gap-1">
          <PomodoroCircles
            pomodorosUntilLongBreak={pomodorosUntilLongBreak}
            totalPomodoroCountInSession={totalPomodoroCountInSession}
          />
        </div>
        <button
          className="ml-4 rounded-md px-1 text-lg hover:text-gray-300"
          onClick={expire}
        >
          <FastForward />
        </button>
      </div>
    </div>
  )
}

export default Timer
