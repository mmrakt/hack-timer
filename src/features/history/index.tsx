import ArrowLeft from '../../components/svg/ArrowLeft'

type IProps = {
  handleDisplayTimer: () => void
}
const History: React.FC<IProps> = ({ handleDisplayTimer }) => {
  return (
    <>
      <div className="flex display-start">
        <ArrowLeft handleClick={handleDisplayTimer} />
      </div>
    </>
  )
}

export default History
