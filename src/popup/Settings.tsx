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
import SettingRow from '../components/settings/SettingRow'

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
      <div className="text-lg p-2">
        <div className="mb-3">
          <p className="text-lg text-center">{t('settings.timer.title')}</p>
          <div className="mt-3 text-zinc-300 text-sm">
            <SettingRow label={t('settings.timer.length.pomodoro')}>
              <TimerLengthSelect
                id="pomodoroSeconds"
                options={POMODORO_LENGTH_ARRAY}
                currentValue={pomodoroSeconds}
              />
            </SettingRow>
            <SettingRow label={t('settings.timer.length.break')}>
              <TimerLengthSelect
                id="breakSeconds"
                options={BREAK_LENGTH_ARRAY}
                currentValue={breakSeconds}
              />
            </SettingRow>
            <SettingRow label={t('settings.timer.length.longBreak')}>
              <TimerLengthSelect
                id="longBreakSeconds"
                options={LONG_BREAK_LENGTH_ARRAY}
                currentValue={longBreakSeconds}
              />
            </SettingRow>
            <SettingRow label={t('settings.timer.count.untilLongBreak')}>
              <TimerLengthSelect
                id="pomodorosUntilLongBreak"
                options={POMODORO_COUNT_UNTIL_LONG_BREAK}
                currentValue={pomodorosUntilLongBreak}
              />
            </SettingRow>
          </div>
        </div>
        <div className="boder-b-2 mb-3">
          <p className="text-lg text-center">
            {t('settings.notification.title')}
          </p>
          <div className="mt-3 text-zinc-300 text-sm">
            <SettingRow label={t('settings.notification.showNewTab.pomodoro')}>
              {showNewTabNotificationWhenPomodoro !== null && (
                <SettingToggle
                  id="showNewTabNotificationWhenPomodoro"
                  currentValue={showNewTabNotificationWhenPomodoro}
                />
              )}
            </SettingRow>
            <SettingRow label={t('settings.notification.desktop.pomodoro')}>
              {showDesktopNotificationWhenPomodoro !== null && (
                <SettingToggle
                  id="showDesktopNotificationWhenPomodoro"
                  currentValue={showDesktopNotificationWhenPomodoro}
                />
              )}
            </SettingRow>
            <SettingRow label={t('settings.notification.showNewTab.break')}>
              {showNewTabpNotificationWhenBreak !== null && (
                <SettingToggle
                  id="showNewTabNotificationWhenBreak"
                  currentValue={showNewTabpNotificationWhenBreak}
                />
              )}
            </SettingRow>
            <SettingRow label={t('settings.notification.desktop.break')}>
              {showDesktopNotificationWhenBreak !== null && (
                <SettingToggle
                  id="showDesktopNotificationWhenBreak"
                  currentValue={showDesktopNotificationWhenBreak}
                />
              )}
            </SettingRow>
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
