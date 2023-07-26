import { t } from 'i18next'
import React from 'react'
import { Phase } from '../../types/index'
import BreakIcon from '../svg/Break'
import FocusIcon from '../svg/Focus'
import { twMerge } from 'tailwind-merge'

type IProps = {
  phase: Phase
  inPopup: boolean
}
const iconStyle = 'w-8 h-8'

const CurrentPhase: React.FC<IProps> = ({ phase, inPopup = false }) => {
  const getCurrentPhaseText = (): string => {
    switch (phase) {
      case 'focus':
        return t('common.pomodoro')
      case 'break':
        return t('common.break')
      case 'longBreak':
        return t('common.longBreak')
    }
  }

  console.log(phase)
  return (
    <div className="flex items-center">
      {phase === 'focus' ? (
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
