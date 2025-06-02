import { FC, HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import ToolTips from '../Default/Tooltips'

export interface CopyProps {
  text: string | number
  classContainer?: HTMLAttributes<HTMLDivElement>['className']
  children?: ReactNode
  msgCopy?: string
}

const CopyComponent: FC<CopyProps> = ({ text, children, classContainer, msgCopy = 'Copied.' }) => {
  const [isCopy, setIsCopy] = useState(false)
  const timeOut = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isCopy) {
      timeOut.current = setTimeout(() => {
        setIsCopy(false)
      }, 800)
    }

    return (): void => {
      clearTimeout(timeOut.current)
    }
  }, [isCopy])

  return (
    <CopyToClipboard
      text={text?.toString() || ''}
      onCopy={(): void => {
        setIsCopy(true)
      }}
      options={{ message: 'copy thành công' }}
    >
      <div className={`relative select-none ${classContainer ?? ''}`}>
        <ToolTips visible={isCopy} arrow={false} content={msgCopy}>
          {children}
        </ToolTips>
      </div>
    </CopyToClipboard>
  )
}

export default CopyComponent
