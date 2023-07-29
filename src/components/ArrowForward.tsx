import React from 'react'
import { twMerge } from 'tailwind-merge'

type IProps = {
  handleClick: () => void
  className?: string
}
const ArrowForward = ({ handleClick, className }: IProps) => {
  return (
    <div className="relative">
      <button
        className={twMerge(
          'icon-border-color absolute left-1 top-1 block h-4 w-4 rotate-45 border-r-2 border-t-2',
          className
        )}
        onClick={handleClick}
      ></button>
    </div>
  )
}

export default ArrowForward
