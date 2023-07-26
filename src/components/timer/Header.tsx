import Chart from '../svg/Chart'
import Cogwheel from '../svg/Cogwheel'
import { useContext } from 'react'
import { DisplayPageContext } from '../../popup/Popup'
import { Phase } from '../../types'
import CurrentPhase from './CurrentPhase'

type IProps = {
  currentPhase: Phase
}
const HeaderMenu: React.FC<IProps> = ({ currentPhase }) => {
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
      <CurrentPhase phase={currentPhase} inPopup />
    </div>
  )
}

export default HeaderMenu
