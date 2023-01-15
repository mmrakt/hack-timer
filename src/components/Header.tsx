import React, { useContext } from 'react'
import { DEFAULT_POPUP_PAGE_TYPE } from '../consts'
import { DisplayPageContext } from '../popup/Popup'
import ArrowLeft from './svg/ArrowLeft'
import { useTranslation } from 'react-i18next'
import { PageType } from '../types'

type IProps = {
  pageType: PageType
}
const Header: React.FC<IProps> = ({ pageType }) => {
  const { setDisplayPageType } = useContext(DisplayPageContext)
  const { t } = useTranslation()
  const getPageTitle = (): string => {
    switch (pageType) {
      case 'history':
        return t('history.pageTitle')
      case 'settings':
        return t('settings.pageTitle')
      default:
        return ''
    }
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <ArrowLeft
          handleClick={() => {
            setDisplayPageType(DEFAULT_POPUP_PAGE_TYPE)
          }}
        />
        <h1 className="text-base mr-3">{getPageTitle()}</h1>
        <span className="ml-3" />
      </div>
    </>
  )
}

export default Header
