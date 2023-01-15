import TimerLengthSelect from './TimerLengthSelect'
import { POMODORO_LENGTH_ARRAY } from '../../consts/index'
import { fireEvent, render } from '@testing-library/react'

describe('', () => {
  it('onChange', () => {
    const { getByRole, getAllByRole } = render(
      <TimerLengthSelect
        id="pomodoroSeconds"
        currentValue={25}
        options={POMODORO_LENGTH_ARRAY}
      />
    )

    expect(
      (getByRole('option', { name: '25' }) as HTMLOptionElement).selected
    ).toBe(true)
    expect(getAllByRole('option').length).toBe(13)

    fireEvent.change(getByRole('combobox'), { target: { value: '20' } })
    expect(
      (getByRole('option', { name: '20' }) as HTMLOptionElement).selected
    ).toBe(true)

    expect(chrome.storage.local.set).toBeCalledWith({ pomodoroSeconds: 20 })
  })
})
