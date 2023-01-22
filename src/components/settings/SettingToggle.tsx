import React, { useState } from 'react'
import { setStorage } from '../../utils/chrome'

type IProps = {
  id:
    | 'showDesktopNotificationWhenPomodoro'
    | 'showDesktopNotificationWhenBreak'
    | 'showNewTabNotificationWhenPomodoro'
    | 'showNewTabNotificationWhenBreak'
  className?: string
  currentValue: boolean
}

const SettingToggle: React.FC<IProps> = ({
  id,
  className = '',
  currentValue
}) => {
  const [checked, setChecked] = useState<boolean>(currentValue)
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    switch (id) {
      case 'showDesktopNotificationWhenPomodoro':
        setStorage({ showDesktopNotificationWhenPomodoro: e.target.checked })
        break
      case 'showDesktopNotificationWhenBreak':
        setStorage({ showDesktopNotificationWhenBreak: e.target.checked })
        break
      case 'showNewTabNotificationWhenPomodoro':
        setStorage({ showNewTabNotificationWhenPomodoro: e.target.checked })
        break
      case 'showNewTabNotificationWhenBreak':
        setStorage({ showNewTabNotificationWhenBreak: e.target.checked })
        break
    }
    setChecked(e.target.checked)
  }
  if (currentValue === null) return <p>loading</p>
  return (
    <>
      <label className="inline-flex relative items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          defaultChecked={checked}
          onChange={(e) => handleOnChange(e)}
        />
        <div className="w-11 h-6 bg-zinc-400 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      </label>
    </>
  )
}

export default SettingToggle
