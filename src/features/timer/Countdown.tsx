import { getTimeFromSeconds } from '@/utils/timeHelper'
import Digit from './Degit'
import Pause from '@/components/common/Pause'
import Play from '@/components/common/Play'

type IProps = {
  remainingSeconds: number
  isRunning: boolean
  onToggleStatus: () => void
}

const Countdown: React.FC<IProps> = ({
  remainingSeconds,
  isRunning,
  onToggleStatus
}) => {
  const { seconds: displaySeconds, minutes: displayMinutes } =
    getTimeFromSeconds(remainingSeconds)

  return (
    <div className="">
      <div id="countdown" className="mt-3 flex w-20 items-center text-2xl">
        <Digit count={displayMinutes} />
        <span className="mx-1 pb-2">:</span>
        <Digit count={displaySeconds} />
      </div>
      {isRunning ? (
        <button
          className="mt-3 flex w-full justify-center"
          onClick={onToggleStatus}
        >
          <Pause />
        </button>
      ) : (
        <button
          className="mt-3 flex w-full justify-center"
          onClick={onToggleStatus}
        >
          <Play />
        </button>
      )}
    </div>
  )
}

export default Countdown
