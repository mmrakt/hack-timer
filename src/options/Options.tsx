import React, { useEffect } from 'react'
import '../styles/globals.css'

const Options: React.FC = () => {
  const onStartBreak = async (): Promise<void> => {
    await chrome.runtime.sendMessage('resumeTimer')
    const queryOptions = { active: true, lastFocusedWindow: true }
    await chrome.tabs.query(queryOptions, async ([result]) => {
      if (result.id) {
        await chrome.tabs.remove(result.id)
      }
    })
  }

  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      onStartBreak()
    }
  }

  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div className="text-zinc-100 p-20">
      <div className="text-center">
        <h1 className="text-5xl">Finish</h1>
      </div>
      <div className="flex justify-center mt-5">
        <button
          onClick={onStartBreak}
          className="text-3xl flex border-4 border-gray-200 p-5 rounded-full hover:border-gray-300"
        >
          Start a Break
        </button>
      </div>
    </div>
  )
}

export default Options
