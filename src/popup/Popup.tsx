import { createContext, useState } from 'react'
import { PageType } from '../types'
import HistoryContainer from './History'
import SettingsContainer from './Settings'
import TimerContainer from './Timer'
import { DEFAULT_POPUP_PAGE_TYPE } from '../consts/index'

export const DisplayPageContext = createContext<any>(null)

const Popup: React.FC = () => {
  const [displayPageType, setDisplayPageType] = useState<PageType>(
    DEFAULT_POPUP_PAGE_TYPE
  )

  return (
    <DisplayPageContext.Provider value={{ setDisplayPageType }}>
      <div className="p-3 base-color border-2 border-gray-700 text-color w-[25rem]">
        {displayPageType === 'timer' ? (
          <TimerContainer />
        ) : displayPageType === 'history' ? (
          <HistoryContainer />
        ) : displayPageType === 'settings' ? (
          <SettingsContainer />
        ) : (
          <p>loading</p>
        )}
      </div>
    </DisplayPageContext.Provider>
  )
}

export default Popup
