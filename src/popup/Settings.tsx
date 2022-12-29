import React from 'react'
import ArrowLeft from '../components/svg/ArrowLeft'
import InputNumber from '../components/InputNumber'
import InputToggle from '../components/InputToggle'

const Settings: React.FC<{ handleDisplayTimer: () => void }> = ({
  handleDisplayTimer
}) => {
  return (
    <div className="w-96">
      <div className="flex display-start mt-3 mx-3">
        <ArrowLeft handleClick={handleDisplayTimer} />
      </div>
      <div className="text-lg p-3">
        <div className="mb-3">
          <p className="text-2xl text-center">Timer</p>
          <div className="mt-3 text-zinc-300">
            <div className="flex items-center px-1">
              <span className="class">Focus length</span>
              <span className="ml-auto">
                <InputNumber id="focusLength" />
              </span>
            </div>
            <div className="flex items-center mt-2 px-1">
              <span className="class">Short break length</span>
              <span className="ml-auto">
                <InputNumber id="shortBreakLength" />
              </span>
            </div>
            <div className="flex items-center mt-2 px-1">
              <span className="class">Long break length</span>
              <span className="ml-auto">
                <InputNumber id="longBreakLength" />
              </span>
            </div>
          </div>
        </div>
        <div className="boder-b-2">
          <p className="text-2xl text-center">Notification</p>
          <div className="mt-3 text-zinc-300">
            <div className="flex items-center px-1">
              <span className="class">Show new tab notification</span>
              <span className="ml-auto">
                <InputToggle id="newTabNotification" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
