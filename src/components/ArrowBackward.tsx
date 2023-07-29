import React from 'react'
import { twMerge } from 'tailwind-merge'

type IProps = {
  handleClick: () => void
  className?: string
}
const ArrowBackward = ({ handleClick, className }: IProps) => {
  return (
    <button onClick={handleClick} className="relative">
      <div
        className={twMerge(
          'icon-border-color absolute left-0 top-0 block h-2 w-2  rotate-45 border-b-2 border-l-2',
          className
        )}
      ></div>
    </button>
  )
}

export default ArrowBackward
