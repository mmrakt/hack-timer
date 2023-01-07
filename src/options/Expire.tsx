import React, { useEffect, useState } from 'react'
import '../styles/globals.css'
import { getStorage } from '../utils/chrome'
import { Message, Phase, StorageValue } from '../types/index'
import { useTranslation } from 'react-i18next'
import { FromPopupMessageType } from '../utils/message'

type IProps = {
  finishPhase: Phase
  dailyPomodoroCount: number
  reminingPomodorCountUntilLongBreak: number
}

const Expire: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const [finishPhase] = useState<Phase>(props.finishPhase)
  const [dailyPomodoroCount] = useState<number>(props.dailyPomodoroCount)
  const [reminingPomodorCountUntilLongBreak] = useState<number>(
    props.reminingPomodorCountUntilLongBreak
  )
  const onStartBreak = async (): Promise<void> => {
    await chrome.runtime.sendMessage<Message>({
      type: FromPopupMessageType.RESUME
    })
    console.log('here')
    const queryOptions = { active: true, lastFocusedWindow: true }
    await chrome.tabs.query(queryOptions, async ([result]) => {
      if (result.id) {
        console.log('hoge')
        await chrome.tabs.remove(result.id)
      }
    })
  }

  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      onStartBreak()
    }
  }

  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const title = t('expire.title').replace(
    '%f',
    finishPhase === 'focus' ? t('common.pomodoro') : t('common.break')
  )
  const message = t('expire.message')
    .replace('%f', String(dailyPomodoroCount))
    .replace('%s', String(reminingPomodorCountUntilLongBreak))

  const buttonText = t('expire.buttonText').replace(
    '%f',
    finishPhase === 'focus' ? t('common.break') : t('common.pomodoro')
  )

  return (
    <div className="text-zinc-100 p-20">
      <div className="text-center">
        <h1 className="text-5xl">{title}</h1>
        <div className="class">
          <p>{message}</p>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <button
          onClick={onStartBreak}
          className="text-3xl flex border-4 border-gray-200 p-5 rounded-full hover:border-gray-300"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}
const ExpireContainer: React.FC = () => {
  const [finishPhase, setFinishPhase] = useState<Phase | null>(null)
  const [dailyPomodoroCount, setDailyPomodoroCount] = useState<number>(0)
  const [
    reminingPomodorCountUntilLongBreak,
    setReminingPomodorCountUntilLongBreak
  ] = useState<number>(0)

  useEffect(() => {
    getStorage([
      'phase',
      'dailyPomodoros',
      'totalPomodoroCountsInSession',
      'pomodoroCountUntilLongBreak'
    ]).then((value: StorageValue) => {
      setFinishPhase(value.phase === 'focus' ? 'break' : 'focus')
      setDailyPomodoroCount(value.dailyPomodoros.slice(-1)[0].count)
      setReminingPomodorCountUntilLongBreak(
        value.pomodoroCountUntilLongBreak - value.totalPomodoroCountsInSession
      )
    })
  }, [])

  if (!finishPhase) return <p>loading</p>

  return (
    <Expire
      finishPhase={finishPhase}
      dailyPomodoroCount={dailyPomodoroCount}
      reminingPomodorCountUntilLongBreak={reminingPomodorCountUntilLongBreak}
    />
  )
}

export { Expire, ExpireContainer }
