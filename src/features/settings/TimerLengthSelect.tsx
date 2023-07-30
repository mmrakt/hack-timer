import React from 'react'
import { useTranslation } from 'react-i18next'
import { getStorage, setStorage } from '../../utils/chrome'
import SelectBox from '../../components/common/SelectBox'

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
            setStorage({
              pomodoroSeconds: formattedValue,
              reminingSeconds: formattedValue
            })
          }
          break
        case 'breakSeconds':
          if (isTimerStarted) {
            setStorage({ updatingBreakSeconds: formattedValue })
          } else {
            setStorage({
              breakSeconds: formattedValue,
              reminingSeconds: formattedValue
            })
          }
          break
        case 'longBreakSeconds':
          if (isTimerStarted) {
            setStorage({ updatingLongBreakSeconds: formattedValue })
          } else {
            setStorage({
              longBreakSeconds: formattedValue,
              reminingSeconds: formattedValue
            })
          }
          break
      }
    }
  }
  return (
    <div className="w-24">
      <label htmlFor={type} />
      <SelectBox
        id={type}
        defaultValue={
          type !== 'pomodorosUntilLongBreak' ? currentValue / 60 : currentValue
        }
        handleChange={(e) => {
          handleOnChange(e)
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectBox>
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
