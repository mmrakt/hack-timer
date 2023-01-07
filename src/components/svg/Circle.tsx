import React from 'react'

type IProps = {
  fillColor?: string
}
const Circle: React.FC<IProps> = ({ fillColor }) => {
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
          stroke="rgb(244 244 245"
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
