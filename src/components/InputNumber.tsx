import React from 'react'

type IProps = {
  id?: string
  className?: string
}
const InputNumber: React.FC<IProps> = ({ id, className = '' }) => {
  return (
    <>
      <label htmlFor={id} />
      <input
        type="number"
        id={id}
        className={`w-16 h-full px-2 py-1 border border-zinc-700 rounded-md bg-zinc-800 sm:text-md text-zinc-100 focus:ring-zinc-600 focus:border-zinc-600 ${className}`}
      />
    </>
  )
}

export default InputNumber
