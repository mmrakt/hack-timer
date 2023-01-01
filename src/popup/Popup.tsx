import { useState, useEffect } from 'react'
import History from './History'
import { PageType, StorageValue, FromServiceWorkerMessge } from '../types/index'
import Chart from '../components/svg/Chart'
import Pause from '../components/svg/Pause'
import Play from '../components/svg/Play'
import Digit from '../components/Degit'
import '../styles/globals.css'
import { getTimeFromSeconds } from '../utils/timeHelper'
import Cogwheel from '../components/svg/Cogwheel'
import Settings from './Settings'

interface IProps {
  reminingSeconds: number
  isRunning: boolean
}

const Timer: React.FC<IProps> = (props) => {
  const [isDisplayPage, setIsDisplayPage] = useState<PageType>('timer')
  const [seconds, setSeconds] = useState<number>(props.reminingSeconds)
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
    chrome.runtime.onMessage.addListener(
      ({
        message,
        secs,
        toggledTimerStatus
      }: {
        message: FromServiceWorkerMessge
        secs: number
        toggledTimerStatus: boolean
      }) => {
        if (message === 'reduceCount') {
          setSeconds(secs)
        } else if (message === 'expire') {
          setSeconds(secs)
          setIsRunning(false)
        } else if (message === 'toggleTimerStatus') {
          setIsRunning(toggledTimerStatus)
        }
      }
    )
  }, [])

  const expire = (): void => {
    chrome.runtime.sendMessage('expire', async () => {})
  }
  const pause = (): void => {
    chrome.runtime.sendMessage('pause', async () => {
      setIsRunning(false)
    })
  }
  const resume = (): void => {
    chrome.runtime.sendMessage('resume', async () => {
      setIsRunning(true)
    })
  }

  switch (isDisplayPage) {
    case 'timer':
      return (
        <div className="w-48 m-6">
          <div className="flex">
            <button
              className="text-lg border-2 border-gray-200 px-2 py-1 rounded-md  hover:border-gray-300 hover:text-gray-300"
              onClick={expire}
            >
              Finish
            </button>
            <button className="ml-auto" onClick={onDisplaySettigns}>
              <Cogwheel />
            </button>
            <button className="ml-auto" onClick={onDisplayHistory}>
              <Chart />
            </button>
          </div>
          <div className="mt-3 text-6xl w-36 mx-auto">
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

  useEffect(() => {
    chrome.runtime.sendMessage('displayPopup', async (result: StorageValue) => {
      setReminingSeconds(result.reminingSeconds)
      setIsRunning(result.isRunning)
    })
  }, [])

  if (!reminingSeconds) return <div>...loading</div>

  return (
    <div className="bg-zinc-900 border-2 border-gray-700 text-zinc-100">
      <Timer reminingSeconds={reminingSeconds} isRunning={isRunning} />
    </div>
  )
}

export default Popup
