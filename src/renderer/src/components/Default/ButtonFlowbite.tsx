import { Button, ButtonProps } from 'flowbite-react'
import { IconType } from 'react-icons'
import { FC, ForwardRefExoticComponent, RefAttributes } from 'react'
import { Link } from 'react-router-dom'
import { LoadingIcon } from '../Icon'
import { LucideProps } from 'lucide-react'

export type ColorButton =
  | 'blue'
  | 'gray'
  | 'dark'
  | 'light'
  | 'success'
  | 'failure'
  | 'warning'
  | 'purple'

type sizeButton = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const buttonVariantClasses: Record<sizeButton, number> = {
  xs: 15,
  sm: 20,
  md: 20,
  lg: 23,
  xl: 25
}

export interface ButtonFlowbiteProps
  extends Omit<ButtonProps, 'color' | 'gradientMonochrome' | 'size'> {
  color?: ColorButton
  gradientMonochrome?: ColorButton
  size?: sizeButton
  StartIcon?:
    | IconType
    | ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  EndIcon?: IconType
  sizeIcon?: number
  hoverBackgroundColor?: string
  hoverClasses?: string
}

const ButtonFlowbite: FC<ButtonFlowbiteProps> = ({
  color,
  size,
  children,
  href,
  StartIcon,
  EndIcon,
  sizeIcon,
  hoverBackgroundColor,
  hoverClasses,
  ...rest
}) => {
  return (
    <Button
      as={href ? Link : null}
      href={href ? href : undefined}
      color={color}
      size={size}
      processingSpinner={<LoadingIcon isSpin />}
      aria-label={color}
      aria-current={rest?.outline}
      className={`${hoverBackgroundColor}`}
      {...rest}
      type={rest?.type ?? 'button'}
    >
      {!rest?.isProcessing && StartIcon && (
        <StartIcon
          className={`mr-2 ${hoverClasses}`}
          size={sizeIcon ? sizeIcon : buttonVariantClasses[size ?? 'sm']}
        />
      )}
      {children}
      {!rest?.isProcessing && EndIcon && (
        <EndIcon
          className={`ml-2 ${hoverClasses}`}
          size={sizeIcon ? sizeIcon : buttonVariantClasses[size ?? 'sm']}
        />
      )}
    </Button>
  )
}

export default ButtonFlowbite
