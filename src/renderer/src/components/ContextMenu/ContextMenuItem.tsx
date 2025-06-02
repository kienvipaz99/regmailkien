import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { RenderContextMenuProps, configContextMenuType } from './RenderContextMenu'

type ContextMenuItemProps = Omit<RenderContextMenuProps, 'renderData' | 'classWapper'> & {
  currentValue: configContextMenuType
  show?: boolean
  isArrow?: boolean
}

const ContextMenuItem: FC<ContextMenuItemProps> = ({
  currentValue,
  expandValue,
  valueClickItem,
  show,
  isArrow
}) => {
  const { t } = useTranslation()
  const Icon = currentValue.Icon

  return (
    <div
      className={`cursor-pointer p-2 flex items-center space-x-2 relative ${
        show ? 'bg-[#555] text-white' : 'hover:bg-[#555] hover:text-white'
      }`}
      onClick={(): void => {
        expandValue &&
          valueClickItem &&
          currentValue?.onClick &&
          currentValue?.onClick?.(valueClickItem, expandValue)
      }}
    >
      <Icon size={20} />
      <span className="text-sm flex-1">{t(`${currentValue.action}`)}</span>
      {isArrow && <MdKeyboardArrowRight size={20} />}
    </div>
  )
}

export default ContextMenuItem
