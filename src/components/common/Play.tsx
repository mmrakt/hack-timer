import { twMerge } from 'tailwind-merge'

type IProps = {
  className?: string
}

const Play: React.FC<IProps> = ({ className = '' }) => {
  return (
    <svg
      id="play"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={twMerge('w-8 h-8 icon-color icon-color-hovered', className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
      />
    </svg>
  )
}

export default Play
