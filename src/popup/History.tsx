import { useState, useEffect } from 'react'
import { DisplayTermType, DailyPomodoro } from '../types/index'
import LoadingSpinner from '../components/LoadingSpinner'
import { HistoryMenu } from '../components/history/HistoryMenu'
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
    <div className="h-[28rem]">
      <Header pageType="history" />
      <div className="mt-3 w-5/6 mx-auto">
        <div className="flex justify-center h-8">
          <div className="w-4/5 flex bg-zinc-800 border-zinc-600 border-[1px] rounded-lg p-1">
            {termTypes.map((term) => (
              <button
                key={term}
                className={`${
                  displayTermType === term ? 'bg-zinc-700' : ''
                } px-2s rounded-md flex-auto`}
                onClick={() => {
                  handleChangeDisplayTermType(term)
                }}
              >
                {getTermTypeString(term)}
              </button>
            ))}
          </div>
          {/* <span className="ml-auto">
            <Dropdown target={<EllipsisHorizontal />} menu={<HistoryMenu />} />
          </span> */}
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
      {dailyPomodoros.length === 0 ? (
        <div className="h-[15rem] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <HistoryChart
          dailyPomodoros={dailyPomodoros}
          displayTermType={displayTermType}
          timesGoBack={timesGoBack}
        />
      )}
      <div className="mb-8 flex justify-center">
        <HistoryMenu />
      </div>
    </div>
  )
}

const HistoryContainer: React.FC = () => {
  return <History />
}

export default HistoryContainer
