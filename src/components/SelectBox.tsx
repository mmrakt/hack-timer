import React from 'react'
import { twMerge } from 'tailwind-merge'

type IProps = {
  id?: string
  defaultValue?: string | number
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => any
  children: React.ReactNode
  className?: string
}

const SelectBox: React.FC<IProps> = ({
  id,
  defaultValue,
  handleChange,
  children,
  className
}) => {
  return (
    <select
      id={id}
      defaultValue={defaultValue}
      onChange={(e) => {
        handleChange(e)
      }}
      className={twMerge(
        'sm:text-md w-16 rounded-md border border-gray-300 px-2 py-[2px] focus:border-gray-500 focus:ring-gray-600  dark:border-gray-600 dark:bg-dark-200',
        className
      )}
    >
      {children}
    </select>
  )
}

export default SelectBox
