import { createContext, useState } from 'react'
import { PageType } from '../types'
import HistoryContainer from './History'
import SettingsContainer from './Settings'
import { DEFAULT_POPUP_PAGE_TYPE } from '../consts/index'
import ThemeProvider from '../components/ThemeProvider'
import TimerContainer from '../components/timer/TimerContainer'

export const DisplayPageContext = createContext<any>(null)

const Popup: React.FC = () => {
  const [displayPageType, setDisplayPageType] = useState<PageType>(
    DEFAULT_POPUP_PAGE_TYPE
  )
  return (
    <ThemeProvider>
      <DisplayPageContext.Provider value={{ setDisplayPageType }}>
        <div className="p-3 base-color border-2 dark:border-gray-700 text-color w-[25rem]">
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
    </ThemeProvider>
  )
}

export default Popup
