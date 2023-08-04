import React from 'react'
import Circle from '../../components/common/Circle'

type IProps = {
  pomodorosUntilLongBreak: number
  totalPomodoroCountInSession: number
  className?: string
}

const PomodoroCircles: React.FC<IProps> = ({
  pomodorosUntilLongBreak,
  totalPomodoroCountInSession,
  className
}) => {
  const circles = []
  for (let i = 0; i < pomodorosUntilLongBreak; i++) {
    if (i < totalPomodoroCountInSession) {
      circles.push(<Circle key={i} isArchived className={className} />)
    } else {
      circles.push(<Circle key={i} className={className} />)
    }
  }
  return <>{circles}</>
}

export default PomodoroCircles
