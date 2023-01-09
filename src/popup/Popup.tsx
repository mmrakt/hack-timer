import { createContext, useState } from 'react'
import { PageType } from '../types'
import HistoryContainer from './History'
import SettingsContainer from './Settings'
import TimerContainer from './Timer'
import { DEFAULT_POPUP_PAGE_TYPE } from '../consts/index'

// TODO: 型付け
// type ContextType = {
//   setDisplayPageType: React.Dispatch<React.SetStateAction<PageType>>
// }
export const DisplayPageContext = createContext<any>(null)

const Popup: React.FC = () => {
  const [displayPageType, setDisplayPageType] = useState<PageType>(
    DEFAULT_POPUP_PAGE_TYPE
  )

  return (
    <DisplayPageContext.Provider value={{ setDisplayPageType }}>
      {displayPageType === 'timer' ? (
        <TimerContainer />
      ) : displayPageType === 'history' ? (
        <HistoryContainer />
      ) : displayPageType === 'settings' ? (
        <SettingsContainer />
      ) : (
        <p>loading</p>
      )}
    </DisplayPageContext.Provider>
  )
}

export default Popup
