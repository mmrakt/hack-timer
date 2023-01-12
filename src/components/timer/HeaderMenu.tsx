import Chart from '../svg/Chart'
import Cogwheel from '../svg/Cogwheel'
import { useContext } from 'react'
import { DisplayPageContext } from '../../popup/Popup'

const HeaderMenu: React.FC = () => {
  const { setDisplayPageType } = useContext(DisplayPageContext)
  return (
    <div className="flex gap-3 justify-start">
      <button
        className=""
        onClick={() => {
          setDisplayPageType('history')
        }}
      >
        <Chart />
      </button>
      <button
        className=""
        onClick={() => {
          setDisplayPageType('settings')
        }}
      >
        <Cogwheel />
      </button>
    </div>
  )
}

export default HeaderMenu
