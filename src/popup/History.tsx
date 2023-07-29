import { useState, useEffect, useContext } from 'react'
import { DisplayTermType, DailyPomodoro } from '../types/index'
import LoadingSpinner from '../components/LoadingSpinner'
import { HistoryMenu } from '../components/history/HistoryMenu'
import { getStorage } from '../utils/chrome'
import HistoryChart from '../components/history/HistoryChart'
import TargetTerm from '../components/history/TargetTerm'
import { useTranslation } from 'react-i18next'
import useFormatHistoryData from '../components/history/hooks/useFormatHisotryData'
import { DEFAULT_POPUP_PAGE_TYPE } from '../consts'
import { DisplayPageContext } from '../components/DisplayPageContextProvider'
import ArrowBackward from '../components/ArrowBackward'

const HistoryContainer: React.FC = () => {
  const { t } = useTranslation()
  const [dailyPomodoros, setDailyPomodoros] = useState<DailyPomodoro[]>([])
  const [displayTermType, setDisplayTermType] =
    useState<DisplayTermType>('week')
  const [timesGoBack, setTimesGoBack] = useState<number>(0)
  const termTypes: DisplayTermType[] = ['week', 'month', 'year']
  const { setDisplayPageType } = useContext(DisplayPageContext)

  useEffect(() => {
    getStorage(['dailyPomodoros']).then((data) => {
      setDailyPomodoros(data.dailyPomodoros)
    })
  }, [displayTermType, timesGoBack])

  const handleChangeDisplayTermType = (term: DisplayTermType): void => {
    setDisplayTermType(term)
    setTimesGoBack(0)
  }

  const handleGoBack = (): void => {
    setTimesGoBack(timesGoBack + 1)
  }

  const handleMoveForward = (): void => {
    setTimesGoBack(timesGoBack - 1)
  }

  const getTermTypeString = (term: DisplayTermType): string => {
    switch (term) {
      case 'week':
        return t('history.termType.weekly')
      case 'month':
        return t('history.termType.monthly')
      case 'year':
        return t('history.termType.yearly')
    }
  }

  const historyData = useFormatHistoryData(
    dailyPomodoros,
    displayTermType,
    timesGoBack
  )

  return (
    <div>
      <ArrowBackward
        handleClick={() => setDisplayPageType(DEFAULT_POPUP_PAGE_TYPE)}
      />
      <div className="mx-auto w-5/6">
        <div className="flex h-8 justify-center">
          <div className="border-color flex w-4/5 rounded-lg border bg-light-200 p-[2px] dark:bg-dark-200">
            {termTypes.map((term) => (
              <button
                key={term}
                className={`${
                  displayTermType === term ? 'bg-white dark:bg-gray-700' : ''
                } px-2s flex-auto rounded-md`}
                onClick={() => {
                  handleChangeDisplayTermType(term)
                }}
              >
                {getTermTypeString(term)}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <TargetTerm
            displayTermType={displayTermType}
            timesGoBack={timesGoBack}
            onGoBack={handleGoBack}
            onMoveForward={handleMoveForward}
          />
        </div>
      </div>
      {historyData.length === 0 ? (
        <div className="flex h-[15rem] items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <HistoryChart historyData={historyData} />
      )}
      <div className="flex justify-center">
        <HistoryMenu />
      </div>
    </div>
  )
}

export default HistoryContainer
