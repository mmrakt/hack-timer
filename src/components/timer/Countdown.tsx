import { getTimeFromSeconds } from '../../utils/timeHelper'
import Digit from '../Degit'

type IProps = {
  reminingSeconds: number
}

const Countdown: React.FC<IProps> = ({ reminingSeconds }) => {
  const { seconds: displaySeconds, minutes: displayMinutes } =
    getTimeFromSeconds(reminingSeconds)
  return (
    <div className="mt-3 text-5xl w-30 font-extralight flex items-center">
      <Digit count={displayMinutes} />
      <span className="pb-2 mx-1">:</span>
      <Digit count={displaySeconds} />
    </div>
  )
}

export default Countdown
