import React from 'react'
import { twMerge } from 'tailwind-merge'

type IProps = {
  handleClick: () => void
  className?: string
}
const ArrowForward = ({ handleClick, className }: IProps) => {
  return (
    <button className="relative" onClick={handleClick}>
      <div
        className={twMerge(
          'icon-border-color absolute left-1 top-1 block h-2 w-2 rotate-45 border-r-2 border-t-2',
          className
        )}
      ></div>
    </button>
  )
}

export default ArrowForward
