import React, { useState } from 'react'
import SettingButton from '../components/SettingButton'
import ArrowLeft from '../components/svg/ArrowLeft'
import { createBlobData, downloadCsv, readCsv } from '../utils/file'
import { DailyFocusedCount } from '../types/index'
import { getStorage, setStorage } from '../background/chrome'
import { EXPORT_CSV_BUTTON_TEXT, IMPORT_CSV_BUTTON_TEXT } from '../consts/index'

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

  const handleOnChange = (): void => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.setAttribute('style', 'display: none; width: 0; height: 0')

    document.body.appendChild(input)
    input.click()
    try {
      input.onchange = (e: Event) => {
        const target = e?.target as HTMLInputElement
        const file = target.files ? target.files[0] : null
        if (file) {
          if (!confirm('履歴を更新しますか？')) {
            return
          }
          const result = readCsv(file)
          result.then((content) => {
            const value = createStorageValue(content)
            setStorage({ dailyFocusedCounts: value })
          })
        }
      }
    } finally {
      document.body.removeChild(input)
    }
  }

  const createStorageValue = (content: string): DailyFocusedCount[] => {
    const csvRows = content.slice(content.indexOf('\n') + 1).split('\n')

    return csvRows.map((row) => {
      // FIXME: refactor
      const values = row.split(',')
      return {
        year: Number(values[0]),
        month: Number(values[1]),
        day: Number(values[2]),
        count: Number(values[3])
      }
    })
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
        <SettingButton
          handleClick={handleOnChange}
          text={IMPORT_CSV_BUTTON_TEXT}
        />
      </div>
    </div>
  )
}

export default Settings
