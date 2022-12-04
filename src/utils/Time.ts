const getTimeFromSeconds = (
  secs: number
): {
  seconds: number
  minutes: number
} => {
  const totalSeconds = Math.ceil(secs)
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return {
    seconds,
    minutes
  }
}

export { getTimeFromSeconds }
