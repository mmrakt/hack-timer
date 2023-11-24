import React, { useState } from 'react'
import { setStorage } from '@/utils/chrome'

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
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          defaultChecked={checked}
          onChange={(e) => handleOnChange(e)}
        />
        <div className="border-color peer h-6 w-11 rounded-full bg-gray-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
      </label>
    </>
  )
}

export default SettingToggle
