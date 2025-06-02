import { cn } from '@renderer/helper'
import { FC, PropsWithChildren } from 'react'

interface FormatOptionItemProps extends PropsWithChildren {
  classWapper?: string
  className?: string
}

const FormatOptionItem: FC<FormatOptionItemProps> = ({
  classWapper,
  children,
  className
}): JSX.Element => {
  return (
    <div
      className={cn(
        'h-[30px] text-center cursor-pointer flex items-center justify-center',
        classWapper
      )}
    >
      <div
        className={cn(
          'border-[1px] border-[#e2e8f0] px-2 rounded-md h-full w-full flex items-center justify-center',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default FormatOptionItem
