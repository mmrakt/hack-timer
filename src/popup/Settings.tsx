import React from 'react'
import ArrowLeft from '../components/svg/ArrowLeft'
import { DailyFocusedCount } from '../types/index'
import { getStorage, setStorage } from '../background/chrome'
import {
  BOM_ARRAY,
  EXPORT_CSV_BUTTON_TEXT,
  HISTORY_CSV_COLUMN_COUNT,
  HISTORY_CSV_FILE_NAME,
  HISTORY_CSV_HEADER_ARRAY,
  IMPORT_CSV_BUTTON_TEXT
} from '../consts/index'
import SettingButton from '../components/SettingButton'
import { useTranslation } from 'react-i18next'
import InputNumber from '../components/InputNumber'
import InputToggle from '../components/InputToggle'

const createBlobData = (dailyFocusedCounts: DailyFocusedCount[]): string => {
  const header = HISTORY_CSV_HEADER_ARRAY.join(',') + '\n'

  let joinedData = ''
  dailyFocusedCounts.forEach((row) => {
    let joinedRow = ''
    for (let i = 0; i < HISTORY_CSV_COLUMN_COUNT; i++) {
      const values = Object.values(row)
      joinedRow += values[i] !== null ? String(values[i]) : ''
      if (i === HISTORY_CSV_COLUMN_COUNT - 1) {
        joinedRow += '\n'
      } else {
        joinedRow += ','
      }
    }
    joinedData += joinedRow
  })
  // 改行削除
  joinedData = joinedData.slice(0, -1)
  return header + joinedData
}

const downloadCsv = (blobData: string): void => {
  const bom = new Uint8Array(BOM_ARRAY)
  const blob = new Blob([bom, blobData], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = HISTORY_CSV_FILE_NAME
  link.click()
}

const readCsv = async (uploadFile: File): Promise<any> => {
  try {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (f) => {
        const content = f?.target?.result
        resolve(content)
      }
      if (uploadFile) reader.readAsText(uploadFile)
    })
  } catch (e) {
    console.error(e)
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

const Settings: React.FC<{ handleDisplayTimer: () => void }> = ({
  handleDisplayTimer
}) => {
  const { t } = useTranslation()
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

  return (
    <div className="w-96">
      <div className="flex display-start mt-3 mx-3">
        <ArrowLeft handleClick={handleDisplayTimer} />
      </div>
      <div className="text-lg p-3">
        <div className="mb-3">
          <p className="text-2xl text-center">Timer</p>
          <div className="mt-3 text-zinc-300">
            <div className="flex items-center px-1">
              <span className="class">Focus length</span>
              <span className="ml-auto">
                <InputNumber id="focusLength" />
              </span>
            </div>
            <div className="flex items-center mt-2 px-1">
              <span className="class">Short break length</span>
              <span className="ml-auto">
                <InputNumber id="shortBreakLength" />
              </span>
            </div>
            <div className="flex items-center mt-2 px-1">
              <span className="class">Long break length</span>
              <span className="ml-auto">
                <InputNumber id="longBreakLength" />
              </span>
            </div>
          </div>
        </div>
        <div className="boder-b-2">
          <p className="text-2xl text-center">Notification</p>
          <div className="mt-3 text-zinc-300">
            <div className="flex items-center px-1">
              <span className="class">Show new tab notification</span>
              <span className="ml-auto">
                <InputToggle id="newTabNotification" />
              </span>
            </div>
          </div>
        </div>
        {/* <SettingButton
          handleClick={handleExport}
          text={EXPORT_CSV_BUTTON_TEXT}
        />
        <div className="mt-5" />
        <SettingButton
          handleClick={handleOnChange}
          text={IMPORT_CSV_BUTTON_TEXT}
        /> */}
      </div>
    </div>
  )
}

export { Settings, readCsv, createBlobData, createStorageValue, downloadCsv }
