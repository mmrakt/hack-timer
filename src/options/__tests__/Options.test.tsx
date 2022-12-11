import { fireEvent, render } from '@testing-library/react'
import Options from '../Options'
import { chrome } from 'jest-chrome'

describe('Option page', () => {
  it('key down enter', () => {
    const renderResult = render(<Options />)

    fireEvent.keyDown(renderResult.container, {
      key: 'Enter'
    })

    expect(chrome.runtime.sendMessage).toBeCalledWith('resumeTimer')
  })
  it('button click', async () => {
    const renderResult = render(<Options />)

    fireEvent.click(renderResult.getByText('Start a Break'))

    expect(chrome.runtime.sendMessage).toBeCalledWith('resumeTimer')
  })
})
