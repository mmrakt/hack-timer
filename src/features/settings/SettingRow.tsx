import { ReactNode } from 'react'

type IProps = {
  label: string
  children: ReactNode
}
const SettingRow: React.FC<IProps> = ({ label, children }) => {
  return (
    <div className="flex items-center px-1 pt-2">
      <span className="class">{label}</span>
      <span className="ml-auto">{children}</span>
    </div>
  )
}

export default SettingRow
