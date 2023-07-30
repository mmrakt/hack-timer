import React from 'react'
import { twMerge } from 'tailwind-merge'

type IProps = {
  text: string
  handleClick?: () => any
  className?: string
}

const Button: React.FC<IProps> = ({ text, handleClick, className }) => {
  return (
    <button
      className={twMerge(
        'text-md mb-3 grid w-full place-items-center rounded-2xl border-2 border-gray-800 px-3 py-1 text-left hover:border-gray-500 hover:text-gray-500 dark:border-gray-300 hover:dark:border-gray-400 hover:dark:text-gray-300 ',
        className
      )}
      onClick={handleClick}
    >
      {text}
    </button>
  )
}

export default Button
