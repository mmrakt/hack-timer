import { render, fireEvent } from '@testing-library/react'
import Settings from '../Settings'
import { EXPORT_CSV_BUTTON_TEXT } from '../../consts/index'
describe('Settings Page', () => {
  beforeEach(() => {})
  afterEach(() => {})
  it('click export button', () => {
    const mockFn = jest.fn()
    const renderResult = render(<Settings handleDisplayTimer={mockFn} />)

    fireEvent.click(renderResult.getByText(EXPORT_CSV_BUTTON_TEXT))
    expect(chrome.storage.local.get).toBeCalled()
  })
})

export {}
