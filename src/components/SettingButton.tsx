import React from 'react'

interface IProps {
  text: string
  handleClick?: () => void
  className?: string
}

const SettingButton: React.FC<IProps> = ({
  text,
  handleClick,
  className = ''
}) => {
  return (
    <button
      onClick={handleClick}
      className={`rounded-2xl px-2 py-1 border-2 hover:border-gray-300 hover:text-gray-300 ${className}`}
    >
      {text}
    </button>
  )
}

export default SettingButton
