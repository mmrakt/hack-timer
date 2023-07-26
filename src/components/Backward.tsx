import React, { useContext } from 'react'
import { DEFAULT_POPUP_PAGE_TYPE } from '../consts'
import { DisplayPageContext } from './DisplayPageContextProvider'

const Backward = () => {
  const { setDisplayPageType } = useContext(DisplayPageContext)
  return (
    <button
      className="absolute block top-1 left-1 w-4 h-4 icon-border-color border-b-2 border-l-2 rotate-45"
      onClick={() => {
        setDisplayPageType(DEFAULT_POPUP_PAGE_TYPE)
      }}
    ></button>
  )
}

export default Backward
