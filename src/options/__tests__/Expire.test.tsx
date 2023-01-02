import { fireEvent, render } from '@testing-library/react'
import { Expire, ExpireContainer } from '../Expire'
import { chrome } from 'jest-chrome'
import { FromPopupMessge } from '../../types/index'
import '@testing-library/jest-dom'

describe('ExpireContainer', () => {
  it('render', () => {
    render(<ExpireContainer />)
    expect(chrome.storage.local.get).toBeCalled()
  })
})

describe('Expire', () => {
  it('render:finish focus', () => {
    const { getByText } = render(
      <Expire
        finishPhase="focus"
        dailyPomodoroCount={1}
        reminingPomodorCountUntilLongBreak={3}
      />
    )
    expect(getByText('expire.title')).toBeInTheDocument()
  })

  it('render:finish break', () => {
    const { getByText } = render(
      <Expire
        finishPhase="break"
        dailyPomodoroCount={1}
        reminingPomodorCountUntilLongBreak={3}
      />
    )
    expect(getByText('expire.title')).toBeInTheDocument()
  })

  it('key down enter', () => {
    const expectedSendMessage: FromPopupMessge = 'resume'
    const { container } = render(
      <Expire
        finishPhase="break"
        dailyPomodoroCount={1}
        reminingPomodorCountUntilLongBreak={3}
      />
    )
    fireEvent.keyDown(container, {
      key: 'Enter'
    })
    expect(chrome.runtime.sendMessage).toBeCalledWith(expectedSendMessage)
  })
  it('button click', async () => {
    const expectedSendMessage: FromPopupMessge = 'resume'
    const { getByText } = render(
      <Expire
        finishPhase="break"
        dailyPomodoroCount={1}
        reminingPomodorCountUntilLongBreak={3}
      />
    )
    fireEvent.click(getByText('expire.buttonText'))
    expect(chrome.runtime.sendMessage).toBeCalledWith(expectedSendMessage)
  })
})
