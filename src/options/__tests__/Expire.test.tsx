import { fireEvent, render } from '@testing-library/react'
import { ExpireMenu, ExpireContainer } from '../Expire'
import { chrome } from 'jest-chrome'
import '@testing-library/jest-dom'
import { FromPopupMessageType } from '../../utils/message'

describe('ExpireContainer', () => {
  it('render', () => {
    render(<ExpireContainer />)
    expect(chrome.storage.local.get).toBeCalled()
  })
})

describe('Expire', () => {
  it('render:finish focus', () => {
    const { getByText } = render(
      <ExpireMenu
        phase="break"
        reminingSeconds={300}
        todayTotalPomodoroCount={1}
        totalPomodoroCountsInSession={1}
        pomodorosUntilLongBreak={3}
      />
    )
    expect(getByText('common.break')).toBeInTheDocument()
  })

  it('render:finish break', () => {
    const { getByText } = render(
      <ExpireMenu
        phase="focus"
        reminingSeconds={1500}
        todayTotalPomodoroCount={1}
        totalPomodoroCountsInSession={1}
        pomodorosUntilLongBreak={3}
      />
    )
    expect(getByText('common.pomodoro')).toBeInTheDocument()
  })

  it('key down enter', () => {
    const expectedSendMessage = { type: FromPopupMessageType.RESUME }
    const { container } = render(
      <ExpireMenu
        phase="focus"
        reminingSeconds={1500}
        todayTotalPomodoroCount={1}
        totalPomodoroCountsInSession={1}
        pomodorosUntilLongBreak={3}
      />
    )
    fireEvent.keyDown(container, {
      key: 'Enter'
    })
    expect(chrome.runtime.sendMessage).toBeCalledWith(expectedSendMessage)
  })
  it('button click', async () => {
    const expectedSendMessage = { type: FromPopupMessageType.RESUME }
    const { getByRole } = render(
      <ExpireMenu
        phase="focus"
        reminingSeconds={1500}
        todayTotalPomodoroCount={1}
        totalPomodoroCountsInSession={1}
        pomodorosUntilLongBreak={3}
      />
    )
    fireEvent.click(getByRole('button'))
    expect(chrome.runtime.sendMessage).toBeCalledWith(expectedSendMessage)
  })
})
