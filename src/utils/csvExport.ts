import {
  BOM_ARRAY,
  EXPORT_CSV_COLUMN_COUNT,
  EXPORT_CSV_FILE_NAME
} from '../consts'
import { DailyFocusedCount } from '../types'
import { EXPORT_CSV_HEADER_ARRAY } from '../consts/index'

const createBlobData = (dailyFocusedCounts: DailyFocusedCount[]): string => {
  const header = EXPORT_CSV_HEADER_ARRAY.join(',') + '\n'

  let joinedData = ''
  dailyFocusedCounts.forEach((row) => {
    let joinedRow = ''
    for (let i = 0; i < EXPORT_CSV_COLUMN_COUNT; i++) {
      const values = Object.values(row)
      joinedRow += values[i] !== null ? String(values[i]) : ''
      if (i === EXPORT_CSV_COLUMN_COUNT - 1) {
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
  console.log(link.href)
  link.download = EXPORT_CSV_FILE_NAME
  link.click()
}

export { createBlobData, downloadCsv }
