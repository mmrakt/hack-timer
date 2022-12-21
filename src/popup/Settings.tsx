import React from 'react'
import SettingButton from '../components/SettingButton'
import ArrowLeft from '../components/svg/ArrowLeft'
import { createBlobData, downloadCsv } from '../utils/csvExport'
import { DailyFocusedCount } from '../types/index'
import { getStorage } from '../background/chrome'
import { EXPORT_CSV_BUTTON_TEXT } from '../consts/index'

const Settings: React.FC<{ handleDisplayTimer: () => void }> = ({
  handleDisplayTimer
}) => {
  const handleExport = (): void => {
    getStorage(['dailyFocusedCounts']).then(
      (dailyFocusedCounts: DailyFocusedCount[]) => {
        const blobData = createBlobData(dailyFocusedCounts)
        downloadCsv(blobData)
      }
    )
  }

  return (
    <div className="w-48">
      <div className="flex display-start mt-3 mx-3">
        <ArrowLeft handleClick={handleDisplayTimer} />
      </div>
      <div className="text-lg">
        <SettingButton
          handleClick={handleExport}
          text={EXPORT_CSV_BUTTON_TEXT}
        />
        <button>Import Hisotry</button>
      </div>
    </div>
  )
}

export default Settings
