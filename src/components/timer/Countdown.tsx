import { getTimeFromSeconds } from '../../utils/timeHelper'
import Digit from '../Degit'

type IProps = {
  reminingSeconds: number
}

const Countdown: React.FC<IProps> = ({ reminingSeconds }) => {
  const { seconds: displaySeconds, minutes: displayMinutes } =
    getTimeFromSeconds(reminingSeconds)
  return (
    <div className="mt-3 text-5xl w-32 font-extralight mx-auto">
      <Digit count={displayMinutes} />:
      <Digit count={displaySeconds} />
    </div>
  )
}

export default Countdown
