import { fireEvent, render } from '@testing-library/react'
import SettingToggle from './SettingToggle'

describe('', () => {
  it('onChange', () => {
    const { getByRole } = render(
      <SettingToggle
        id="showNewTabNotificationWhenPomodoro"
        currentValue={true}
      />
    )

    const checkbox = getByRole('checkbox')

    fireEvent.click(checkbox)

    expect(chrome.storage.local.set).toBeCalledWith({
      showNewTabNotificationWhenPomodoro: false
    })
  })
})
