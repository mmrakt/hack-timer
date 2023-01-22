import { createContext, useState } from 'react'
import { PageType } from '../types'
import HistoryContainer from './History'
import SettingsContainer from './Settings'
import TimerContainer from './Timer'
import { DEFAULT_POPUP_PAGE_TYPE } from '../consts/index'
import { useMatchMedia } from '../hooks/useMatchMedia'

type Theme = 'light' | 'dark'
type IThemeContext = {
  theme: Theme
}

export const DisplayPageContext = createContext<any>(null)
export const ThemeContext = createContext<IThemeContext>({ theme: 'light' })

const Popup: React.FC = () => {
  const [displayPageType, setDisplayPageType] = useState<PageType>(
    DEFAULT_POPUP_PAGE_TYPE
  )
  const theme = useMatchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light'

  return (
    <ThemeContext.Provider value={{ theme }}>
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
    </ThemeContext.Provider>
  )
}

export default Popup
