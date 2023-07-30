import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useState
} from 'react'
import { Phase } from '../types'
import { DEFAULT_PHASE } from '../consts/index'

type CurrentPhaseContextType = {
  currentPhase: Phase
  setCurrentPhase: Dispatch<SetStateAction<Phase>>
}
export const CurrentPhaseContext = createContext<CurrentPhaseContextType>({
  currentPhase: 'focus',
  setCurrentPhase: () => {}
})

const CurrentPhaseContextProvider = ({
  children
}: {
  children: ReactElement
}) => {
  const [currentPhase, setCurrentPhase] = useState<Phase>(DEFAULT_PHASE)
  return (
    <CurrentPhaseContext.Provider value={{ currentPhase, setCurrentPhase }}>
      {children}
    </CurrentPhaseContext.Provider>
  )
}

export default CurrentPhaseContextProvider
