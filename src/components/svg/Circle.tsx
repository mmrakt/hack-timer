import React, { useEffect, useState, useContext } from 'react'
import LoadingSpinner from '../LoadingSpinner'
import { ThemeContext } from '../ThemeProvider'
import { COLOR } from '../../consts/color'

type IProps = {
  isArchived?: boolean
}
const white = COLOR.dark[100]
const black = COLOR.light[100]

const Circle: React.FC<IProps> = ({ isArchived = false }) => {
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
        className="h-3 w-3"
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
