import React, { useEffect, useState, useContext } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { COLOR } from '../../consts/color'
import { ThemeContext } from '../../providers/ThemeProvider'
import { twMerge } from 'tailwind-merge'

type IProps = {
  isArchived?: boolean
  className?: string
}
const white = COLOR.gray[50]
const black = COLOR.gray[950]

const Circle: React.FC<IProps> = ({ isArchived = false, className = '' }) => {
  const [fillColor, setFillColor] = useState<string>('')
  const [strokeColor, setStrokeColor] = useState<string>('')
  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    if (theme === 'dark') {
      setStrokeColor(white)
      if (isArchived) {
        setFillColor(white)
      } else {
        setFillColor(black)
      }
    } else {
      setStrokeColor(black)
      if (isArchived) {
        setFillColor(black)
      } else {
        setFillColor(white)
      }
    }
  })
  if (fillColor === '' || strokeColor === '') return <LoadingSpinner />

  return (
    <>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        className={twMerge('h-3 w-3', className)}
      >
        <circle
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="15"
          cx="50"
          cy="50"
          r="40"
        ></circle>
      </svg>
    </>
  )
}

export default Circle
