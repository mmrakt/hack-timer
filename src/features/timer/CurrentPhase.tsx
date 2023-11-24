import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import BreakIcon from '../../components/common/Break'
import FocusIcon from '../../components/common/Focus'
import { twMerge } from 'tailwind-merge'
import { getStorage } from '../../utils/chrome'
import { Phase } from '../../types'

type IProps = {
  inPopup: boolean
}
const iconStyle = 'w-8 h-8'

const CurrentPhase: React.FC<IProps> = ({ inPopup = false }) => {
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null)

  useEffect(() => {
    getStorage(['phase']).then(({ phase }) => {
      setCurrentPhase(phase)
    })
  })
  const getCurrentPhaseText = (): string => {
    switch (currentPhase) {
      case 'focus':
        return t('common.pomodoro')
      case 'break':
        return t('common.break')
      case 'longBreak':
        return t('common.longBreak')
      default:
        return ''
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
