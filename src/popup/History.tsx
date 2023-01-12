import { useState, useEffect } from 'react'
import { DisplayTermType, DailyPomodoro } from '../types/index'
import LoadingSpinner from '../components/LoadingSpinner'
import EllipsisHorizontal from '../components/svg/EllipsisHorizontal'
import Dropdown from '../components/Dropdown'
import { DropdownMenu } from '../components/history/DropdownMenu'
import { getStorage } from '../utils/chrome'
import HistoryChart from '../components/history/HistoryChart'
import TargetTerm from '../components/history/TargetTerm'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'

const History: React.FC = () => {
  const { t } = useTranslation()
  const [dailyPomodoros, setDailyPomodoros] = useState<DailyPomodoro[]>([])
  const [displayTermType, setDisplayTermType] =
    useState<DisplayTermType>('week')
  const [timesGoBack, setTimesGoBack] = useState<number>(0)
  const termTypes: DisplayTermType[] = ['week', 'month', 'year']

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

  return (
    <>
      <Header pageType="history" />
      <span className="ml-auto">
        <Dropdown target={<EllipsisHorizontal />} menu={<DropdownMenu />} />
      </span>
      <div className="mt-3 w-5/6 mx-auto">
        <div className="flex bg-zinc-800 border-zinc-600 border-[1px] rounded-lg p-1">
          {termTypes.map((term) => (
            <button
              key={term}
              className={`${
                displayTermType === term ? 'bg-zinc-700' : ''
              } px-2 py-1 rounded-md flex-grow`}
              onClick={() => {
                handleChangeDisplayTermType(term)
              }}
            >
              {getTermTypeString(term)}
            </button>
          ))}
        </div>
        <TargetTerm
          displayTermType={displayTermType}
          timesGoBack={timesGoBack}
          onGoBack={handleGoBack}
          onMoveForward={handleMoveForward}
        />
      </div>
      {dailyPomodoros.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <HistoryChart
          dailyPomodoros={dailyPomodoros}
          displayTermType={displayTermType}
          timesGoBack={timesGoBack}
        />
      )}
    </>
  )
}

const HistoryContainer: React.FC = () => {
  return <History />
}

export default HistoryContainer
