import React, { useEffect, useState } from 'react'
import TimerLengthSelect from '../components/settings/TimerLengthSelect'
import SettingToggle from '../components/settings/SettingToggle'
import { useTranslation } from 'react-i18next'
import { getStorage } from '../utils/chrome'
import { StorageValue } from '../types/index'
import {
  POMODORO_LENGTH_ARRAY,
  BREAK_LENGTH_ARRAY,
  LONG_BREAK_LENGTH_ARRAY,
  POMODORO_COUNT_UNTIL_LONG_BREAK
} from '../consts/index'
import Header from '../components/Header'

const Settings: React.FC = () => {
  const { t } = useTranslation()
  const [pomodoroSeconds, setpomodoroSeconds] = useState<number>(0)
  const [breakSeconds, setbreakSeconds] = useState<number>(0)
  const [longBreakSeconds, setlongBreakSeconds] = useState<number>(0)
  const [
    showDesktopNotificationWhenPomodoro,
    setShowDesktopNotificationWhenPomodoro
  ] = useState<boolean | null>(null)
  const [
    showDesktopNotificationWhenBreak,
    setShowDesktopNotificationWhenBreak
  ] = useState<boolean | null>(null)
  const [
    showNewTabNotificationWhenPomodoro,
    setShowNewTabpNotificationWhenPomodoro
  ] = useState<boolean | null>(null)
  const [
    showNewTabpNotificationWhenBreak,
    setShowNewTabpNotificationWhenBreak
  ] = useState<boolean | null>(null)
  const [pomodorosUntilLongBreak, setpomodorosUntilLongBreak] =
    useState<number>(0)

  useEffect(() => {
    getStorage([
      'pomodoroSeconds',
      'breakSeconds',
      'longBreakSeconds',
      'showDesktopNotificationWhenPomodoro',
      'showDesktopNotificationWhenBreak',
      'showNewTabNotificationWhenPomodoro',
      'showNewTabNotificationWhenBreak',
      'pomodorosUntilLongBreak'
    ]).then((value: StorageValue) => {
      setpomodoroSeconds(value.pomodoroSeconds)
      setbreakSeconds(value.breakSeconds)
      setlongBreakSeconds(value.longBreakSeconds)
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
      setpomodorosUntilLongBreak(value.pomodorosUntilLongBreak)
    })
  }, [])

  return (
    <>
      <Header pageType="settings" />
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
                  id="pomodoroSeconds"
                  options={POMODORO_LENGTH_ARRAY}
                  currentValue={pomodoroSeconds}
                />
              </span>
            </div>
            <div className="flex items-center mt-2 px-1">
              <span className="class">{t('settings.timer.length.break')}</span>
              <span className="ml-auto">
                <TimerLengthSelect
                  id="breakSeconds"
                  options={BREAK_LENGTH_ARRAY}
                  currentValue={breakSeconds}
                />
              </span>
            </div>
            <div className="flex items-center mt-2 px-1">
              <span className="class">
                {t('settings.timer.length.longBreak')}
              </span>
              <span className="ml-auto">
                <TimerLengthSelect
                  id="longBreakSeconds"
                  options={LONG_BREAK_LENGTH_ARRAY}
                  currentValue={longBreakSeconds}
                />
              </span>
            </div>
            <div className="flex items-center mt-2 px-1">
              <span className="class">
                {t('settings.timer.count.untilLongBreak')}
              </span>
              <span className="ml-auto">
                <TimerLengthSelect
                  id="pomodorosUntilLongBreak"
                  options={POMODORO_COUNT_UNTIL_LONG_BREAK}
                  currentValue={pomodorosUntilLongBreak}
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
                {showNewTabNotificationWhenPomodoro !== null && (
                  <SettingToggle
                    id="showNewTabNotificationWhenPomodoro"
                    currentValue={showNewTabNotificationWhenPomodoro}
                  />
                )}
              </span>
            </div>
            <div className="flex items-center px-1">
              <span className="class">
                {t('settings.notification.desktop.pomodoro')}
              </span>
              <span className="ml-auto">
                {showDesktopNotificationWhenPomodoro !== null && (
                  <SettingToggle
                    id="showDesktopNotificationWhenPomodoro"
                    currentValue={showDesktopNotificationWhenPomodoro}
                  />
                )}
              </span>
            </div>
            <div className="flex items-center px-1">
              <span className="class">
                {t('settings.notification.showNewTab.break')}
              </span>
              <span className="ml-auto">
                {showNewTabpNotificationWhenBreak !== null && (
                  <SettingToggle
                    id="showNewTabNotificationWhenBreak"
                    currentValue={showNewTabpNotificationWhenBreak}
                  />
                )}
              </span>
            </div>
            <div className="flex items-center px-1">
              <span className="class">
                {t('settings.notification.desktop.break')}
              </span>
              <span className="ml-auto">
                {showDesktopNotificationWhenBreak !== null && (
                  <SettingToggle
                    id="showDesktopNotificationWhenBreak"
                    currentValue={showDesktopNotificationWhenBreak}
                  />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const SettingsContainer: React.FC = () => {
  return <Settings />
}

export default SettingsContainer
