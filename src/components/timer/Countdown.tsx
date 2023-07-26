import { getTimeFromSeconds } from '../../utils/timeHelper'
import Digit from '../Degit'
import Pause from '../svg/Pause'
import Play from '../svg/Play'

type IProps = {
  reminingSeconds: number
  isRunning: boolean
  onToggleStatus: () => void
}

const Countdown: React.FC<IProps> = ({
  reminingSeconds,
  isRunning,
  onToggleStatus
}) => {
  const { seconds: displaySeconds, minutes: displayMinutes } =
    getTimeFromSeconds(reminingSeconds)

  return (
    <div className="">
      <div id="countdown" className="mt-3 w-20 text-2xl flex items-center">
        <Digit count={displayMinutes} />
        <span className="pb-2 mx-1">:</span>
        <Digit count={displaySeconds} />
      </div>
      {isRunning ? (
        <button
          className="w-full flex justify-center mt-3"
          onClick={onToggleStatus}
        >
          <Pause />
        </button>
      ) : (
        <button
          className="w-full flex justify-center mt-3"
          onClick={onToggleStatus}
        >
          <Play />
        </button>
      )}
    </div>
  )
}

export default Countdown
