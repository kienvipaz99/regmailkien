import { configItemSidebar } from '@renderer/config'
import { useLayoutChangeTitle } from '@renderer/context'
import { cn } from '@renderer/helper'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

interface SubmenuItemProps {
  render?: configItemSidebar[]
  isActiveParent?: boolean
  isDistanceSidebar?: boolean
  refContent?: React.RefObject<HTMLUListElement>
}

const SubmenuItem: FC<SubmenuItemProps> = ({
  render,
  isActiveParent,
  isDistanceSidebar,
  refContent
}) => {
  const { currentSlidebar } = useLayoutChangeTitle()
  const { t } = useTranslation()
  return (
    <ul
      className={cn(
        'overflow-hidden sub-menu text-gray-500',
        isDistanceSidebar ? 'distance_sidebar bg-white shadow-form border' : 'h-0'
      )}
      ref={refContent}
    >
      {render?.map((child, indexChild) => {
        const activeChildIndex = currentSlidebar?.activeIndex?.[1] ?? -1
        const isActiveChild = isActiveParent && activeChildIndex === indexChild
        const isDisabled = child?.isDisabled

        return (
          <li
            key={indexChild}
            className={cn(
              isActiveChild && 'bg-linear rounded-lg',
              isDisabled && 'disable cursor-not-allowed pointer-events-none opacity-[0.5]',
              'mb-[1px]'
            )}
          >
            <NavLink
              to={child?.path ?? ''}
              className={cn(
                'flex items-center !pl-[25px] !py-[7px]',
                isDisabled && 'cursor-not-allowed'
              )}
              style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
            >
              <span
                className={cn(
                  ' dark:text-[#506690] dark:group-hover:text-white-dark whitespace-nowrap line-left',
                  isActiveChild ? 'text-white' : ''
                )}
              >
                {t(`${child?.title}`)}
              </span>
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}

export default SubmenuItem
