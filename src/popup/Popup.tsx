import { useContext } from 'react'
import History from './History'
import Settings from './Settings'
import DisplayPageContextProvider, {
  DisplayPageContext
} from '@/providers/DisplayPageContextProvider'
import Timer from './Timer'
import ThemeProvider from '@/providers/ThemeProvider'

const PopupInner = () => {
  const { displayPageType } = useContext(DisplayPageContext)

  return (
    <div className="base-bg-color text-color min-w-[22rem] max-w-[26rem] border-2 p-4 dark:border-gray-950">
      {displayPageType === 'timer' ? (
        <Timer />
      ) : displayPageType === 'history' ? (
        <History />
      ) : displayPageType === 'settings' ? (
        <Settings />
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
        <PopupInner />
      </DisplayPageContextProvider>
    </ThemeProvider>
  )
}

export default Popup
