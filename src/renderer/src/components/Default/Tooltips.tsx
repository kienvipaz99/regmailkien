import Tippy, { TippyProps } from '@tippyjs/react'
import { FC, ReactNode, useState } from 'react'
import { BsQuestionCircle } from 'react-icons/bs'
import { IconType } from 'react-icons/lib'
import 'tippy.js/dist/tippy.css'

export interface ToolTipsCustom extends Omit<TippyProps, 'children'> {
  Icon?: IconType
  sizeIcon?: number
  classNameIcon?: string
  classWapper?: string
  clickWapper?: (Instance: unknown) => void
  children?: ReactNode
}

const ToolTips: FC<ToolTipsCustom> = ({
  children,
  Icon = BsQuestionCircle,
  sizeIcon = 14,
  classNameIcon,
  classWapper,
  clickWapper,
  ...rest
}) => {
  const [Instance, setInstance] = useState<unknown>()

  return (
    <Tippy
      onCreate={(instance): void => {
        setInstance(instance)
      }}
      // duration={300}
      // maxWidth={250}
      {...rest}
    >
      <div
        draggable="false"
        className={classWapper ?? ''}
        onClick={(): void => {
          clickWapper && clickWapper(Instance)
        }}
      >
        {children}
        {!children && (
          <Icon size={sizeIcon} className={`text-gray-91 cursor-pointer ${classNameIcon ?? ''}`} />
        )}
      </div>
    </Tippy>
  )
}

export default ToolTips
