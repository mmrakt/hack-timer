import { getStorage, setStorage } from '../../utils/chrome'
import {
  BOM_ARRAY,
  HISTORY_CSV_FILE_NAME,
  HISTORY_CSV_HEADER_ARRAY
} from '../../consts'
import { DailyPomodoro } from '../../types'
import { useTranslation } from 'react-i18next'
import { NEW_LINE_CODE } from '../../consts/index'
import Button from '../Button'

const createStorageValue = (content: string): DailyPomodoro[] => {
  const newLineCodes =
    NEW_LINE_CODE.CR + '|' + NEW_LINE_CODE.LF + '|' + NEW_LINE_CODE.CRLF
  const replacedContent = content.replace(
    '/' + newLineCodes + '/',
    NEW_LINE_CODE.LF
  )
  const csvRows = replacedContent
    .slice(replacedContent.indexOf('\n') + 1)
    .split('\n')
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
    if (row.count === 0 || row.day === 0 || row.month === 0 || row.year === 0) {
      return
    }
    joinedData +=
      String(row.year) +
      ',' +
      String(row.month) +
      ',' +
      String(row.day) +
      ',' +
      String(row.count) +
      '\n'
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

const isValidContent = (content: string): boolean => {
  if (!content) {
    return false
  } else {
    return true
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
            if (!isValidContent(content)) {
              alert(t('history.import.invalidMessage'))
            }
            const storageValues = createStorageValue(content)
            setStorage({ dailyPomodoros: storageValues })
          })
        }
      }
    } finally {
      document.body.removeChild(input)
    }
  }
  return (
    <div>
      <Button
        text={t('history.export.buttonText')}
        handleClick={handleExport}
      />
      <Button
        text={t('history.import.buttonText')}
        handleClick={handleOnChange}
      />
    </div>
  )
}

export { HistoryMenu, createBlobData, createStorageValue, downloadCsv, readCsv }
