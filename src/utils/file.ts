import {
  BOM_ARRAY,
  HISTORY_CSV_COLUMN_COUNT,
  HISTORY_CSV_FILE_NAME,
  HISTORY_CSV_HEADER_ARRAY
} from '../consts'
import { DailyFocusedCount } from '../types'

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

export { createBlobData, downloadCsv, readCsv }
