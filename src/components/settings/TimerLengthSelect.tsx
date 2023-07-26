import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { getStorage, setStorage } from '../../utils/chrome'
import { CurrentPhaseContext } from '../CurrentPhaseContextProvider'

type IProps = {
  type:
    | 'pomodoroSeconds'
    | 'breakSeconds'
    | 'longBreakSeconds'
    | 'pomodorosUntilLongBreak'
  className?: string
  currentValue: number
  options: number[] | string[]
}
const TimerLengthSelect: React.FC<IProps> = ({
  type,
  className = '',
  currentValue,
  options
}) => {
  const { t } = useTranslation()
  if (!currentValue || !options) return <p>loading</p>
  // const { currentPhase } = useContext(CurrentPhaseContext)

  const handleOnChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    if (!e) return

    if (type === 'pomodorosUntilLongBreak') {
      setStorage({ pomodorosUntilLongBreak: Number(e.target.value) })
    } else {
      const isTimerStarted = await (
        await getStorage(['isTimerStarted'])
      ).isTimerStarted
      const formattedValue = Number(e.target.value) * 60
      switch (type) {
        case 'pomodoroSeconds':
          if (isTimerStarted) {
            setStorage({ updatingPomodoroSeconds: formattedValue })
          } else {
            setStorage({ pomodoroSeconds: formattedValue })
          }
          break
        case 'breakSeconds':
          if (isTimerStarted) {
            setStorage({ updatingBreakSeconds: formattedValue })
          } else {
            setStorage({ breakSeconds: formattedValue })
          }
          break
        case 'longBreakSeconds':
          if (isTimerStarted) {
            setStorage({ updatingLongBreakSeconds: formattedValue })
          } else {
            setStorage({ longBreakSeconds: formattedValue })
          }
          break
      }
    }
  }
  return (
    <div className="w-24">
      <label htmlFor={type} />
      <select
        id={type}
        defaultValue={
          type !== 'pomodorosUntilLongBreak' ? currentValue / 60 : currentValue
        }
        onChange={(e) => {
          handleOnChange(e)
        }}
        className={`w-16 px-2 py-[2px] border border-gray-300 rounded-md base-bg-layer-color dark:border-gray-600 sm:text-md  focus:ring-gray-600 focus:border-gray-500 ${className}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="ml-2">
        {type === 'pomodoroSeconds' ||
        type === 'breakSeconds' ||
        type === 'longBreakSeconds'
          ? t('settings.timer.length.unit')
          : ''}
      </span>
    </div>
  )
}

export default TimerLengthSelect
