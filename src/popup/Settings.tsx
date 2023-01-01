import React, { useEffect, useState } from 'react'
import ArrowLeft from '../components/svg/ArrowLeft'
import TimerLengthSelect from '../components/settings/TimerLengthSelect'
import SettingToggle from '../components/settings/SettingToggle'
import { useTranslation } from 'react-i18next'
import { getStorage } from '../utils/chrome'
import { StorageValue } from '../types/index'
import {
  POMODORO_LENGTH_ARRAY,
  BREAK_LENGTH_ARRAY,
  LONG_BREAK_LENGTH_ARRAY
} from '../consts/index'

const Settings: React.FC<{ handleDisplayTimer: () => void }> = ({
  handleDisplayTimer
}) => {
  const { t } = useTranslation()
  const [pomodoroLength, setPomodoroLength] = useState<number>(0)
  const [breakLength, setBreakLength] = useState<number>(0)
  const [longBreakLength, setLongBreakLength] = useState<number>(0)
  const [
    showDesktopNotificationWhenPomodoro,
    setShowDesktopNotificationWhenPomodoro
  ] = useState<boolean>(true)
  const [
    showDesktopNotificationWhenBreak,
    setShowDesktopNotificationWhenBreak
  ] = useState<boolean>(true)
  const [
    showNewTabNotificationWhenPomodoro,
    setShowNewTabpNotificationWhenPomodoro
  ] = useState<boolean>(true)
  const [
    showNewTabpNotificationWhenBreak,
    setShowNewTabpNotificationWhenBreak
  ] = useState<boolean>(true)

  useEffect(() => {
    getStorage([
      'pomodoroLength',
      'breakLength',
      'longBreakLength',
      'showDesktopNotificationWhenPomodoro',
      'showDesktopNotificationWhenBreak',
      'showNewTabNotificationWhenPomodoro',
      'showNewTabNotificationWhenBreak'
    ]).then((value: StorageValue) => {
      setPomodoroLength(value.pomodoroLength)
      setBreakLength(value.breakLength)
      setLongBreakLength(value.longBreakLength)
      setShowDesktopNotificationWhenPomodoro(
        value.showDesktopNotificationWhenPomodoro
      )
      setShowDesktopNotificationWhenBreak(
        value.showDesktopNotificationWhenBreak
      )
      setShowNewTabpNotificationWhenPomodoro(
        value.showNewTabNotificationWhenPomodoro
      )
      setShowNewTabpNotificationWhenBreak(value.showNewTabNotificationWhenBreak)
    })
  }, [])

  return (
    <div className="w-96">
      <div className="flex display-start mt-3 mx-3">
        <ArrowLeft handleClick={handleDisplayTimer} />
      </div>
      <div className="text-lg p-3">
        <div className="mb-3">
          <p className="text-lg text-center">{t('settings.timer.title')}</p>
          <div className="mt-3 text-zinc-300 text-sm">
            <div className="flex items-center px-1">
              <span className="class">
                {t('settings.timer.length.pomodoro')}
              </span>
              <span className="ml-auto">
                <TimerLengthSelect
                  id="pomodoroLength"
                  options={POMODORO_LENGTH_ARRAY}
                  currentValue={pomodoroLength}
                />
              </span>
            </div>
            <div className="flex items-center mt-2 px-1">
              <span className="class">{t('settings.timer.length.break')}</span>
              <span className="ml-auto">
                <TimerLengthSelect
                  id="breakLength"
                  options={BREAK_LENGTH_ARRAY}
                  currentValue={breakLength}
                />
              </span>
            </div>
            <div className="flex items-center mt-2 px-1">
              <span className="class">
                {t('settings.timer.length.longBreak')}
              </span>
              <span className="ml-auto">
                <TimerLengthSelect
                  id="longBreakLength"
                  options={LONG_BREAK_LENGTH_ARRAY}
                  currentValue={longBreakLength}
                />
              </span>
            </div>
          </div>
        </div>
        <div className="boder-b-2">
          <p className="text-lg text-center">
            {t('settings.notification.title')}
          </p>
          <div className="mt-3 text-zinc-300 text-sm">
            <div className="flex items-center px-1">
              <span className="class">
                {t('settings.notification.showNewTab.pomodoro')}
              </span>
              <span className="ml-auto">
                <SettingToggle
                  id="showNewTabNotificationWhenPomodoro"
                  currentValue={showNewTabNotificationWhenPomodoro}
                />
              </span>
            </div>
            <div className="flex items-center px-1">
              <span className="class">
                {t('settings.notification.desktop.pomodoro')}
              </span>
              <span className="ml-auto">
                <SettingToggle
                  id="showDesktopNotificationWhenPomodoro"
                  currentValue={showDesktopNotificationWhenPomodoro}
                />
              </span>
            </div>
            <div className="flex items-center px-1">
              <span className="class">
                {t('settings.notification.showNewTab.break')}
              </span>
              <span className="ml-auto">
                <SettingToggle
                  id="showNewTabNotificationWhenBreak"
                  currentValue={showNewTabpNotificationWhenBreak}
                />
              </span>
            </div>
            <div className="flex items-center px-1">
              <span className="class">
                {t('settings.notification.desktop.break')}
              </span>
              <span className="ml-auto">
                <SettingToggle
                  id="showDesktopNotificationWhenBreak"
                  currentValue={showDesktopNotificationWhenBreak}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
