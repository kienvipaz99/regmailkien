import { cn } from '@renderer/helper'
import { FC, HTMLProps, ReactNode } from 'react'

interface BoxItemFormProps extends HTMLProps<HTMLDivElement> {
  disable?: boolean
  children?: ReactNode
  hiddenBg?: boolean
  isDashed?: boolean
  bgTitle?: string
}

const BoxItemForm: FC<BoxItemFormProps> = ({
  children,
  disable,
  hiddenBg,
  isDashed,
  title,
  bgTitle = '#fff',
  ...spread
}) => {
  return (
    <div
      {...spread}
      className={cn(
        'border px-3 py-5 rounded-lg',
        disable && !hiddenBg && 'bg-white',
        isDashed && 'border-dashed',
        title && 'relative',
        spread?.className
      )}
    >
      {title && (
        <div
          className="absolute top-0 left-[3%] -translate-y-1/2 px-2"
          style={{
            backgroundColor: bgTitle
          }}
        >
          <h3 className="font-bold text-blue-600">{title}</h3>
        </div>
      )}

      {children}
    </div>
  )
}

export default BoxItemForm
