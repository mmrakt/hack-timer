import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../LoadingSpinner'

type IProps = {
  isArchived?: boolean
}
const white = 'rgb(244 244 245'
const black = 'rgb(24 24 27'
const gray = 'rgb(50, 50, 54'

const Circle: React.FC<IProps> = ({ isArchived = false }) => {
  const [fillColor, setFillColor] = useState<string>('')
  const [strokeColor, setStrokeColor] = useState<string>('')
  useEffect(() => {
    if (window?.matchMedia('(prefers-color-scheme: dark)').matches) {
      setStrokeColor(white)
      if (isArchived) {
        setFillColor(white)
      } else {
        setFillColor(black)
      }
    } else {
      setStrokeColor(gray)
      if (isArchived) {
        setFillColor(gray)
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
        className="h-3 w-3"
      >
        <circle
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="20"
          cx="50"
          cy="50"
          r="40"
        ></circle>
      </svg>
    </>
  )
}

export default Circle
