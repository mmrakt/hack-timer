import { Dispatch, SetStateAction, createContext, useState } from 'react'
import { PageType, Phase } from '../types'
import HistoryContainer from './History'
import SettingsContainer from './Settings'
import { DEFAULT_PHASE, DEFAULT_POPUP_PAGE_TYPE } from '../consts/index'
import ThemeProvider from '../components/ThemeProvider'
import TimerContainer from '../components/timer/TimerContainer'

type DisplayPageContextType = {
  displayPageType?: PageType
  setDisplayPageType: Dispatch<SetStateAction<PageType>>
}
export const DisplayPageContext = createContext<DisplayPageContextType>({
  displayPageType: 'timer',
  setDisplayPageType: () => {}
})
type CurrentPhaseContextType = {
  currentPhase: Phase
  setCurrentPhase: Dispatch<SetStateAction<Phase>>
}
export const CurrentPhaseContext = createContext<CurrentPhaseContextType>({
  currentPhase: 'focus',
  setCurrentPhase: () => {}
})

const Popup: React.FC = () => {
  const [displayPageType, setDisplayPageType] = useState<PageType>(
    DEFAULT_POPUP_PAGE_TYPE
  )
  const [currentPhase, setCurrentPhase] = useState<Phase>(DEFAULT_PHASE)
  return (
    <ThemeProvider>
      <DisplayPageContext.Provider
        value={{ displayPageType, setDisplayPageType }}
      >
        <CurrentPhaseContext.Provider value={{ currentPhase, setCurrentPhase }}>
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
        </CurrentPhaseContext.Provider>
      </DisplayPageContext.Provider>
    </ThemeProvider>
  )
}

export default Popup
