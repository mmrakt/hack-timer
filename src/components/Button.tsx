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
        'text-md mb-3 grid w-full place-items-center rounded-2xl border-2 border-light-300 px-3 py-1 text-left hover:bg-light-300 dark:border-dark-300 hover:dark:bg-dark-300',
        className
      )}
      onClick={handleClick}
    >
      {text}
    </button>
  )
}

export default Button
