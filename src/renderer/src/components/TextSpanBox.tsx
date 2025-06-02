import { cn } from '@renderer/helper'
import { FC, HTMLProps, ReactNode } from 'react'

interface TextSpanBoxProps extends HTMLProps<HTMLSpanElement> {
  children?: ReactNode
  italic?: boolean
  underline?: boolean
  color?: color
}

type color = 'blue' | 'red' | 'green' | 'orange'

const textBoxVariant: Record<color, string> = {
  blue: 'text-blue-600',
  red: 'text-red-600',
  green: 'text-green-600',
  orange: 'text-orange-600'
}

const TextSpanBox: FC<TextSpanBoxProps> = ({
  children,
  italic,
  underline,
  color,
  ...spread
}): JSX.Element => {
  return (
    <span
      {...spread}
      className={cn(
        'text-sm font-medium block',
        italic && 'italic',
        underline && 'underline',
        spread?.className,
        color && textBoxVariant[color]
      )}
    >
      {children}
    </span>
  )
}

export default TextSpanBox
