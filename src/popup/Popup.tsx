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
        <div className="p-4 base-bg-color border-2 dark:border-dark-100 text-color min-w-[22rem] max-w-[26rem]">
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
