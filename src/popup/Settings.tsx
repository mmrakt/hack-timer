import React from 'react'
import ArrowLeft from '../components/svg/ArrowLeft'

const Settings: React.FC<{ handleDisplayTimer: () => void }> = ({
  handleDisplayTimer
}) => {
  return (
    <>
      <div className="flex display-start mt-3 mx-3">
        <ArrowLeft handleClick={handleDisplayTimer} />
      </div>
    </>
  )
}

export default Settings
