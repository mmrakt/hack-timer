let lifeline: chrome.runtime.Port | null

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'keepAlive') {
    lifeline = port
    setTimeout(keepAliveForced, 60000)
    port.onDisconnect.addListener(keepAliveForced)
  }
})

const keepAliveForced = async (): Promise<void> => {
  lifeline?.disconnect()
  lifeline = null
  await keepAlive()
}

const keepAlive = async (): Promise<void> => {
  if (lifeline != null) return
  chrome.runtime.connect({ name: 'keepAlive' })
}

export default keepAlive
