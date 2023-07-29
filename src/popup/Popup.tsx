import { useContext } from 'react'
import HistoryContainer from './History'
import SettingsContainer from './Settings'
import ThemeProvider from '../components/ThemeProvider'
import DisplayPageContextProvider, {
  DisplayPageContext
} from '../components/DisplayPageContextProvider'
import CurrentPhaseContextProvider from '../components/CurrentPhaseContextProvider'
import TimerContainer from '../components/TimerContainer'

const PopupInner = () => {
  const { displayPageType } = useContext(DisplayPageContext)

  return (
    <div className="base-bg-color text-color min-w-[22rem] max-w-[26rem] border-2 p-4 dark:border-dark-100">
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
  )
}
const Popup: React.FC = () => {
  return (
    <ThemeProvider>
      <DisplayPageContextProvider>
        <CurrentPhaseContextProvider>
          <PopupInner />
        </CurrentPhaseContextProvider>
      </DisplayPageContextProvider>
    </ThemeProvider>
  )
}

export default Popup
