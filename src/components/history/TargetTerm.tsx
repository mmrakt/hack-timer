import dayjs from 'dayjs'
import ja from 'dayjs/locale/ja'
import { useState, useEffect } from 'react'
import { DisplayTermType } from '../../types'
import ChevronLeft from '../svg/ChevronLeft'
import ChevronRight from '../svg/ChevronRight'

dayjs.locale(ja)

type IProps = {
  displayTermType: DisplayTermType
  timesGoBack: number
  onGoBack: () => void
  onMoveForward: () => void
}
const TargetTerm: React.FC<IProps> = ({
  displayTermType,
  timesGoBack,
  onGoBack,
  onMoveForward
}) => {
  const [targetSinceDate, setTargetSinceDate] = useState<string>('')
  const [targetUntilDate, setTargetUntilDate] = useState<string>('')

  useEffect(() => {
    setTargetTerm()
  }, [displayTermType, timesGoBack])

  const setTargetTerm = (): void => {
    switch (displayTermType) {
      case 'week':
        // TODO: 月曜始まりに直す
        setTargetSinceDate(
          dayjs()
            .startOf('week')
            .subtract(timesGoBack, 'week')
            .format('YYYY/MM/DD')
        )
        setTargetUntilDate(
          dayjs()
            .endOf('week')
            .subtract(timesGoBack, 'week')
            .format('YYYY/MM/DD')
        )
        break
      case 'month':
        setTargetSinceDate(
          dayjs()
            .startOf('month')
            .subtract(timesGoBack, 'month')
            .format('YYYY/MM/DD')
        )
        setTargetUntilDate(
          dayjs()
            .endOf('month')
            .subtract(timesGoBack, 'month')
            .format('YYYY/MM/DD')
        )
        break
      case 'year':
        setTargetSinceDate(
          dayjs()
            .startOf('year')
            .subtract(timesGoBack, 'year')
            .format('YYYY/MM/DD')
        )
        setTargetUntilDate(
          dayjs()
            .endOf('year')
            .subtract(timesGoBack, 'year')
            .format('YYYY/MM/DD')
        )
        break
    }
  }

  const handleGoBack = (): void => {
    onGoBack()
  }

  const handleMoveForward = (): void => {
    if (timesGoBack > 0) {
      onMoveForward()
    }
  }

  return (
    <div className="flex justify-between items-center mt-3 text-base">
      <button onClick={handleGoBack}>
        <ChevronLeft />
      </button>
      {targetSinceDate + ' ~ ' + targetUntilDate}
      <button onClick={handleMoveForward}>
        <ChevronRight />
      </button>
    </div>
  )
}

export default TargetTerm
