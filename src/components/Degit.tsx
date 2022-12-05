const Digit: React.FC<{ count: number }> = ({ count }) => {
  const leftDigit = count >= 10 ? count.toString()[0] : '0'
  const rightDigit = count >= 10 ? count.toString()[1] : count.toString()
  return (
    <>
      <span className="">{leftDigit}</span>
      <span className="">{rightDigit}</span>
    </>
  )
}

export default Digit
