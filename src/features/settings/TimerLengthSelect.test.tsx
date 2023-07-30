import TimerLengthSelect from './TimerLengthSelect'
import { POMODORO_LENGTH_ARRAY } from '../../consts/index'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { chrome } from 'jest-chrome'
import userEvent from '@testing-library/user-event'

describe('TimerLengthSelect', () => {
  // TODO: getStorageでawaitの有無に関わらず結果が返ってこない原因調査
  it('onChange', async () => {
    const { getByRole, getAllByRole } = render(
      <TimerLengthSelect
        type="pomodoroSeconds"
        currentValue={25}
        options={POMODORO_LENGTH_ARRAY}
      />
    )

    expect(getAllByRole('option').length).toBe(12)
    const response = { isTimerStarted: false }
    chrome.storage.local.get.mockImplementation(() => response)

    await userEvent.selectOptions(getByRole('combobox'), ['20'])

    await waitFor(() => {
      expect(chrome.storage.local.set).toBeCalledWith({ pomodoroSeconds: 1200 })
    })
  })
})
