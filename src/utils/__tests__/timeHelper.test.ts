import { formatDisplayTime, getTimeFromSeconds } from '../timeHelper'

describe('timeHelper', () => {
  it('getTimerFromSeconds', () => {
    expect(getTimeFromSeconds(1000)).toStrictEqual({
      seconds: 40,
      minutes: 16
    })
  })

  it('formatDisplayTime', () => {
    expect(formatDisplayTime(30, 10)).toBe('10:30')
    expect(formatDisplayTime(5, 5)).toBe('05:05')
  })
})
