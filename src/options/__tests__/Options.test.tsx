import { fireEvent, render } from '@testing-library/react'
import StartBreak from '../StartBreak'
import { chrome } from 'jest-chrome'
import { FromPopupMessge } from '../../types/index'

describe('Option page', () => {
  it('key down enter', () => {
    const expectedSendMessage: FromPopupMessge = 'resume'
    const renderResult = render(<StartBreak />)

    fireEvent.keyDown(renderResult.container, {
      key: 'Enter'
    })

    expect(chrome.runtime.sendMessage).toBeCalledWith(expectedSendMessage)
  })
  it('button click', async () => {
    const expectedSendMessage: FromPopupMessge = 'resume'
    const renderResult = render(<StartBreak />)

    fireEvent.click(renderResult.getByText('Start a Break'))

    expect(chrome.runtime.sendMessage).toBeCalledWith(expectedSendMessage)
  })
})
