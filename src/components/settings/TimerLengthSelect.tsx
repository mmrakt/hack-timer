import React from 'react'
import { useTranslation } from 'react-i18next'
import { setStorage } from '../../utils/chrome'

type IProps = {
  id:
    | 'pomodoroLength'
    | 'breakLength'
    | 'longBreakLength'
    | 'pomodoroCountUntilLongBreak'
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
    const value = Number(e.target.value)

    switch (id) {
      case 'pomodoroLength':
        setStorage({ pomodoroLength: value })
        break
      case 'breakLength':
        setStorage({ breakLength: value })
        break
      case 'longBreakLength':
        setStorage({ longBreakLength: value })
        break
      case 'pomodoroCountUntilLongBreak':
        setStorage({ pomodoroCountUntilLongBreak: value })
    }
  }
  return (
    <>
      <label htmlFor={id} />
      <select
        id={id}
        defaultValue={currentValue}
        onChange={(e) => {
          handleOnChange(e)
        }}
        className={`w-16 h-full px-2 py-1 border border-zinc-700 rounded-md bg-zinc-800 sm:text-md text-zinc-100 focus:ring-zinc-600 focus:border-zinc-600 ${className}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="class">
        {id === 'pomodoroLength' ||
        id === 'breakLength' ||
        id === 'longBreakLength'
          ? t('settings.timer.length.unit')
          : t('settings.timer.count.unit')}
      </span>
    </>
  )
}

export default TimerLengthSelect
