import { cn } from '@renderer/helper'
import type { WapperLabelFormProps } from '@renderer/types'
import { FC } from 'react'

const WapperLabelForm: FC<WapperLabelFormProps> = ({
  classWapper,
  isRequired,
  label,
  children,
  clsLabelWrapper,
  isVertical
}) => {
  return (
    <div className={cn(!isVertical && 'max-md:flex-col flex items-start', classWapper)}>
      {label && (
        <span
          className={cn(
            'text-sm mb-2 font-medium block',
            !isVertical && `w-[12rem] flex-shrink-0`,
            clsLabelWrapper
          )}
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </span>
      )}

      <div className="w-full">{children}</div>
    </div>
  )
}

export default WapperLabelForm
