import React from 'react'
import { toast } from 'react-toastify'

interface ICopyToClipboardProps {
  content: string | null
  children: React.ReactNode
}

const CopyToClipboard: React.FC<ICopyToClipboardProps> = ({ content, children }) => {
  const handleClick = async (): Promise<void> => {
    if (navigator.clipboard && content) {
      try {
        await navigator.clipboard.writeText(content)
        toast.success(`Sao chép thành công`)
      } catch (error) {
        toast.error(`Sao chép thất bại`)
      }
    } else {
      toast.error('Không có nội dung để sao chép')
    }
  }

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }} className="">
      {children}
    </div>
  )
}

export default CopyToClipboard
