import { DailyFocusedCount } from '../../types/index'
import { createBlobData, downloadCsv } from '../file'
import { EXPORT_CSV_FILE_NAME } from '../../consts/index'
describe('Option page', () => {
  const expectedData =
    'year,month,day,count\n2022,12,1,10\n2022,12,3,5\n2022,12,4,3\n'
  it('createdBlobData', () => {
    const testData: DailyFocusedCount[] = [
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

    const result = createBlobData(testData)
    expect(result).toBe(expectedData)
  })

  it('downloadCsv', () => {
    const link = {
      click: jest.fn(),
      download: jest.fn(),
      href: ''
    } as unknown as HTMLAnchorElement
    jest.spyOn(document, 'createElement').mockImplementation(() => link)
    URL.createObjectURL = jest.fn()

    downloadCsv(expectedData)

    expect(link.download).toEqual(EXPORT_CSV_FILE_NAME)
    expect(link.click).toHaveBeenCalledTimes(1)
  })
})
