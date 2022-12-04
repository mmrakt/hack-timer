const Digit: React.FC<{ value: number }> = ({ value }) => {
  const leftDigit = value >= 10 ? value.toString()[0] : '0'
  const rightDigit = value >= 10 ? value.toString()[1] : value.toString()
  return (
    <>
      <span className="">{leftDigit}</span>
      <span className="">{rightDigit}</span>
    </>
  )
}

export default Digit
