import React from 'react'
import Circle from '../../components/common/Circle'

type IProps = {
  pomodorosUntilLongBreak: number
  totalPomodoroCountInSession: number
}

const PomodoroCircles: React.FC<IProps> = ({
  pomodorosUntilLongBreak,
  totalPomodoroCountInSession
}) => {
  const circles = []
  for (let i = 0; i < pomodorosUntilLongBreak; i++) {
    if (i < totalPomodoroCountInSession) {
      circles.push(<Circle key={i} isArchived />)
    } else {
      circles.push(<Circle key={i} />)
    }
  }
  return <>{circles}</>
}

export default PomodoroCircles
