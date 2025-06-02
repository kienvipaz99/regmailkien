import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

const Portal = ({ children }: { children: ReactNode }): JSX.Element => {
  return createPortal(children, document.body)
}

export default Portal
