import { cn } from '@renderer/helper'
import { FC, HTMLProps, ReactNode } from 'react'

type TLayout = '3|7' | '7|3' | '5|5' | '10' | '6.5|3.5' | '6|4' | '4|6'

interface LayoutWapperProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode
  layout?: TLayout
}

const LayoutVariantClasses: Record<TLayout, string> = {
  '3|7':
    '[&>:first-child]:w-[370px] [&>:last-child]:w-[75%] max-xl:[&>:first-child]:w-[40%] max-xl:[&>:last-child]:w-[60%] max-lg:[&>*]:w-[50%]',
  '4|6':
    '[&>:first-child]:w-[40%] [&>:last-child]:w-[60%] max-xl:[&>:first-child]:w-[40%] max-xl:[&>:last-child]:w-[40%] max-lg:[&>*]:w-[50%]',
  '5|5': '[&>*]:w-[50%]',
  '7|3':
    '[&>:first-child]:w-[70%] [&>:last-child]:w-[30%] max-xl:[&>:first-child]:w-[60%] max-xl:[&>:last-child]:w-[40%] max-lg:[&>*]:w-[50%]',
  '10': '[&>*]:w-full',
  '6.5|3.5':
    '[&>:first-child]:w-[65%] [&>:last-child]:w-[35%] max-xl:[&>:first-child]:w-[55%] max-xl:[&>:last-child]:w-[45%] max-lg:[&>*]:w-[50%]',
  '6|4':
    '[&>:first-child]:w-[60%] [&>:last-child]:w-[40%] max-xl:[&>:first-child]:w-[60%] max-xl:[&>:last-child]:w-[40%] max-lg:[&>*]:w-[50%]'
}

const LayoutWapper: FC<LayoutWapperProps> = ({ children, layout = '6.5|3.5', ...spread }) => {
  return (
    <div
      {...spread}
      className={cn('flex gap-3 justify-between', LayoutVariantClasses[layout], spread?.className)}
    >
      {children}
    </div>
  )
}

export default LayoutWapper
