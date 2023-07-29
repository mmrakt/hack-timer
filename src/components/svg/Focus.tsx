import React, { useContext } from 'react'
import { ThemeContext } from '../ThemeProvider'
import { COLOR } from '../../consts/color'
import { twMerge } from 'tailwind-merge'

const FocusIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme } = useContext(ThemeContext)
  return (
    <>
      <svg
        fill={theme === 'dark' ? COLOR.light[300] : COLOR.dark[300]}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 32 32"
        xmlSpace="preserve"
        stroke="currentColor"
        className={twMerge('h-12 w-12', className)}
      >
        <path
          className="linesandangles_een"
          d="M30,21.5c0-2.094-1.278-3.839-3-4.341V16h-1v-1c0-5.514-4.486-10-10-10S6,9.486,6,15v1H5
            v1.159c-1.722,0.502-3,2.246-3,4.341s1.278,3.839,3,4.341V27h5V16H8v-1c0-4.411,3.589-8,8-8s8,3.589,8,8v1h-2v11h5v-1.159
            C28.722,25.339,30,23.594,30,21.5z M4,21.5c0-0.924,0.403-1.732,1-2.164v4.329C4.403,23.232,4,22.423,4,21.5z M8,25H7v-7h1V25z
            M24,18h1v7h-1V18z M27,23.664v-4.329c0.597,0.433,1,1.241,1,2.164C28,22.423,27.597,23.232,27,23.664z"
        />
      </svg>
    </>
  )
}

export default FocusIcon
