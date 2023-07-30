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
          'icon-border-color absolute left-1 top-1 block h-2 w-2 rotate-45 border-r-[3px] border-t-[3px]',
          className
        )}
      ></div>
    </button>
  )
}

export default ArrowForward
