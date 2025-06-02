import { cn } from '@renderer/helper'
import { FC, HTMLAttributes, ReactNode } from 'react'

interface FieldsetWapperProps {
  children?: ReactNode
  title?: string
  classWapper?: string
  hiddenScroll?: boolean
  classNameChildren?: HTMLAttributes<HTMLDivElement>['className']
}

const FieldsetWapper: FC<FieldsetWapperProps> = ({
  children,
  title,
  classWapper,
  hiddenScroll,
  classNameChildren
}) => {
  return (
    <div
      className={cn(
        'rounded-lg relative border-solid border border-gray-300 h-[82vh]',
        classWapper
      )}
    >
      {title && (
        <div className="flex items-center justify-between absolute -top-[15px] left-[15px] bg-[#fafafa] px-[5px] py-0">
          <p className="text-lg font-bold">{title}</p>
        </div>
      )}
      <div
        className={cn(
          !hiddenScroll && 'overflow-y-auto custom_scroll mx-1 overflow-x-hidden',
          !hiddenScroll && title && 'mt-4',
          !hiddenScroll && title ? 'h-[97%]' : 'h-full',
          'p-[10px]',
          classNameChildren
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default FieldsetWapper
