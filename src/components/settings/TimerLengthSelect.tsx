import React from 'react'
import { useTranslation } from 'react-i18next'
import { setStorage } from '../../utils/chrome'

type IProps = {
  id:
    | 'pomodoroSeconds'
    | 'breakSeconds'
    | 'longBreakSeconds'
    | 'pomodorosUntilLongBreak'
  className?: string
  currentValue: number
  options: number[] | string[]
}
const TimerLengthSelect: React.FC<IProps> = ({
  id,
  className = '',
  currentValue,
  options
}) => {
  const { t } = useTranslation()
  if (!currentValue || !options) return <p>loading</p>

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    if (!e) return

    switch (id) {
      case 'pomodoroSeconds':
        setStorage({ pomodoroSeconds: Number(e.target.value) * 60 })
        break
      case 'breakSeconds':
        setStorage({ breakSeconds: Number(e.target.value) * 60 })
        break
      case 'longBreakSeconds':
        setStorage({ longBreakSeconds: Number(e.target.value) * 60 })
        break
      case 'pomodorosUntilLongBreak':
        setStorage({ pomodorosUntilLongBreak: Number(e.target.value) })
    }
  }
  return (
    <div className="w-24">
      <label htmlFor={id} />
      <select
        id={id}
        defaultValue={
          id !== 'pomodorosUntilLongBreak' ? currentValue / 60 : currentValue
        }
        onChange={(e) => {
          handleOnChange(e)
        }}
        className={`w-16 h-full px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 sm:text-md  focus:ring-gray-600 focus:border-gray-500 ${className}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="class">
        {id === 'pomodoroSeconds' ||
        id === 'breakSeconds' ||
        id === 'longBreakSeconds'
          ? t('settings.timer.length.unit')
          : ''}
      </span>
    </div>
  )
}

export default TimerLengthSelect
