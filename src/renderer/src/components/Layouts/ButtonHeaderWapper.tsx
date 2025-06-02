import { cn } from '@renderer/helper'
import { FC, HTMLProps, ReactNode } from 'react'
import ToolTips, { ToolTipsCustom } from '../Default/Tooltips'

export interface ButtonHeaderWapperProps
  extends Omit<HTMLProps<HTMLDivElement>, 'content'>,
    Pick<ToolTipsCustom, 'content'> {
  children?: ReactNode
  tooltips?: Omit<ToolTipsCustom, 'content'>
}

const ButtonHeaderWapper: FC<ButtonHeaderWapperProps> = ({
  children,
  content,
  tooltips,
  ...props
}): JSX.Element => {
  return (
    <ToolTips content={content} disabled={tooltips?.disabled || !content}>
      <div
        {...props}
        className={cn('bg-[#E3E8EF] p-[4px] rounded-full cursor-pointer', props?.className)}
      >
        {children}
      </div>
    </ToolTips>
  )
}

export default ButtonHeaderWapper
