import React, { useContext } from 'react'
import { DEFAULT_POPUP_PAGE_TYPE } from '../consts'
import { DisplayPageContext } from '../popup/Popup'
import ArrowLeft from './svg/ArrowLeft'
import { PageType } from '../types'

type IProps = {
  pageType: PageType
}
const Header: React.FC<IProps> = ({ pageType }) => {
  const { setDisplayPageType } = useContext(DisplayPageContext)

  return (
    <>
      <div className="flex items-center justify-between">
        <ArrowLeft
          handleClick={() => {
            setDisplayPageType(DEFAULT_POPUP_PAGE_TYPE)
          }}
        />
        <span className="ml-3" />
      </div>
    </>
  )
}

export default Header
