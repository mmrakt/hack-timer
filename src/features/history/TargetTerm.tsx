import dayjs from 'dayjs'
import ja from 'dayjs/locale/ja'
import { useState, useEffect } from 'react'
import { DisplayTermType } from '../../types'
import ArrowBackward from '../../components/common/ArrowBackward'
import ArrowForward from '../../components/common/ArrowForward'

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
    <div className="flex items-center justify-center gap-6 text-sm">
      <ArrowBackward handleClick={handleGoBack} className="static h-2 w-2" />
      {targetSinceDate + ' ~ ' + targetUntilDate}
      {timesGoBack !== 0 ? (
        <ArrowForward
          handleClick={handleMoveForward}
          className="static h-2 w-2"
        />
      ) : (
        <span className="ml-5" />
      )}
    </div>
  )
}

export default TargetTerm
