import { getStorage, setStorage } from '../../utils/chrome'
import {
  BOM_ARRAY,
  HISTORY_CSV_COLUMN_COUNT,
  HISTORY_CSV_FILE_NAME,
  HISTORY_CSV_HEADER_ARRAY
} from '../../consts'
import { DailyPomodoro } from '../../types'
import { useTranslation } from 'react-i18next'

const createStorageValue = (content: string): DailyPomodoro[] => {
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

const createBlobData = (dailyPomodoros: DailyPomodoro[]): string => {
  const header = HISTORY_CSV_HEADER_ARRAY.join(',') + '\n'

  let joinedData = ''
  dailyPomodoros.forEach((row) => {
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

const HistoryMenu: React.FC = () => {
  const { t } = useTranslation()
  const handleExport = (): void => {
    getStorage(['dailyPomodoros']).then(({ dailyPomodoros }) => {
      const blobData = createBlobData(dailyPomodoros)
      downloadCsv(blobData)
    })
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
          const message = t('history.import.confirmMessage')
          if (!confirm(message)) {
            return
          }
          const result = readCsv(file)
          result.then((content) => {
            const value = createStorageValue(content)
            setStorage({ dailyPomodoros: value })
          })
        }
      }
    } finally {
      document.body.removeChild(input)
    }
  }
  const style =
    'px-3 py-1 mb-3 text-left text-xs hover:bg-zinc-200 hover:dark:bg-zinc-600 border-2 border-zinc-200 rounded-2xl w-full grid place-items-center'
  return (
    <div className="w-40">
      <button className={style} onClick={handleExport}>
        {t('history.export.buttonText')}
      </button>
      <button className={style} onClick={handleOnChange}>
        {t('history.import.buttonText')}
      </button>
    </div>
  )
}

export { HistoryMenu, createBlobData, createStorageValue, downloadCsv, readCsv }
