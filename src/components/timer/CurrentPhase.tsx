import { t } from 'i18next'
import React from 'react'
import { Phase } from '../../types/index'
import BreakIcon from '../svg/Break'
import FocusIcon from '../svg/Focus'

type IProps = {
  phase: Phase
  inPopup?: boolean
}
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
  return (
    <div className="flex justify-center items-center">
      <span className="mr-3">
        {phase === 'focus' ? (
          <FocusIcon className={inPopup ? 'w-8 h-8' : ''} />
        ) : (
          <BreakIcon className={inPopup ? 'w-8 h-8' : ''} />
        )}
      </span>
      <span className={inPopup ? 'text-lg' : 'text-2xl'}>
        {getCurrentPhaseText()}
      </span>
    </div>
  )
}

export default CurrentPhase
