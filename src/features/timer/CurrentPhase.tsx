import { t } from 'i18next'
import React, { useContext } from 'react'
import BreakIcon from '../../components/common/Break'
import FocusIcon from '../../components/common/Focus'
import { twMerge } from 'tailwind-merge'
import { CurrentPhaseContext } from '../../providers/CurrentPhaseContextProvider'

type IProps = {
  inPopup: boolean
}
const iconStyle = 'w-8 h-8'

const CurrentPhase: React.FC<IProps> = ({ inPopup = false }) => {
  const { currentPhase } = useContext(CurrentPhaseContext)
  const getCurrentPhaseText = (): string => {
    switch (currentPhase) {
      case 'focus':
        return t('common.pomodoro')
      case 'break':
        return t('common.break')
      case 'longBreak':
        return t('common.longBreak')
    }
  }

  return (
    <div className="flex items-center">
      {currentPhase === 'focus' ? (
        <FocusIcon className={inPopup ? iconStyle : ''} />
      ) : (
        <BreakIcon className={inPopup ? iconStyle : ''} />
      )}
      <span className={twMerge('ml-1', inPopup ? 'text-base' : 'text-2xl')}>
        {getCurrentPhaseText()}
      </span>
    </div>
  )
}

export default CurrentPhase
