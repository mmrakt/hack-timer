import { render, fireEvent } from '@testing-library/react'
import { HISTORY_CSV_FILE_NAME } from '@/consts/index'
import { DailyPomodoro } from '@/types'
import {
  HistoryMenu,
  createBlobData,
  createStorageValue,
  downloadCsv
} from './HistoryMenu'

describe('Settings', () => {
  const csvData = 'year,month,day,count\n2022,12,1,10\n2022,12,3,5\n2022,12,4,3'
  const storageData: DailyPomodoro[] = [
    {
      year: 2022,
      month: 12,
      day: 1,
      count: 10
    },
    {
      year: 2022,
      month: 12,
      day: 3,
      count: 5
    },
    {
      year: 2022,
      month: 12,
      day: 4,
      count: 3
    }
  ]
  it('createdBlobData', () => {
    const result = createBlobData(storageData)
    expect(result).toBe(csvData)
  })

  it('createStorageValue', () => {
    const actual = createStorageValue(csvData)
    expect(actual).toEqual(storageData)
  })

  it('click export button', () => {
    const renderResult = render(<HistoryMenu />)

    fireEvent.click(renderResult.getByText('history.export.buttonText'))
    expect(chrome.storage.local.get).toBeCalled()
  })

  it('downloadCsv', () => {
    const link = {
      click: jest.fn(),
      download: jest.fn(),
      href: ''
    } as unknown as HTMLAnchorElement
    jest.spyOn(document, 'createElement').mockImplementation(() => link)
    URL.createObjectURL = jest.fn()

    downloadCsv(csvData)

    expect(link.download).toEqual(HISTORY_CSV_FILE_NAME)
    expect(link.click).toHaveBeenCalledTimes(1)
  })
})

export {}
