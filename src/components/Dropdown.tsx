import React, { useRef, useState, useEffect, ReactElement } from 'react'

type IProps = {
  target: ReactElement
  menu: ReactElement
}
const Dropdown: React.FC<IProps> = ({ target, menu }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleOutsideClick = (e: any): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <div ref={dropdownRef} className="relative inline-block text-left">
        <span className="rounded-md shadow-sm">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            {target}
          </button>
        </span>

        {isOpen && (
          <>
            <div className="-translate-x-28 -translate-y-4 absolute bg-zinc-700 left-0 mt-2 w-60 rounded-md shadow-xl z-50">
              <div className="rounded-md shadow-xs">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {menu}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Dropdown
