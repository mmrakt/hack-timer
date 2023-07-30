import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useState
} from 'react'
import { PageType } from '../types'
import { DEFAULT_POPUP_PAGE_TYPE } from '../consts/index'

type DisplayPageContextType = {
  displayPageType?: PageType
  setDisplayPageType: Dispatch<SetStateAction<PageType>>
}
export const DisplayPageContext = createContext<DisplayPageContextType>({
  displayPageType: 'timer',
  setDisplayPageType: () => {}
})

const DisplayPageContextProvider = ({
  children
}: {
  children: ReactElement
}) => {
  const [displayPageType, setDisplayPageType] = useState<PageType>(
    DEFAULT_POPUP_PAGE_TYPE
  )
  return (
    <DisplayPageContext.Provider
      value={{ displayPageType, setDisplayPageType }}
    >
      {children}
    </DisplayPageContext.Provider>
  )
}

export default DisplayPageContextProvider
