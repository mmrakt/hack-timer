import Chart from '@/components/common/Chart'
import Cogwheel from '@/components/common/Cogwheel'
import { useContext } from 'react'
import CurrentPhase from './CurrentPhase'
import { DisplayPageContext } from '@/providers/DisplayPageContextProvider'

const HeaderMenu = () => {
  const { setDisplayPageType } = useContext(DisplayPageContext)
  return (
    <div className="flex justify-between">
      <div className="flex gap-3">
        <button
          onClick={() => {
            setDisplayPageType('history')
          }}
        >
          <Chart />
        </button>
        <button
          onClick={() => {
            setDisplayPageType('settings')
          }}
        >
          <Cogwheel />
        </button>
      </div>
      <CurrentPhase inPopup />
    </div>
  )
}

export default HeaderMenu
