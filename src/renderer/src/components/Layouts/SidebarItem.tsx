import { configSidebarType } from '@renderer/config'
import { useLayoutChangeTitle, useLayoutSidebar } from '@renderer/context'
import { cn } from '@renderer/helper'
import { FC, Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import AccordionWapper from '../AccordionWapper'
import HoverDropdown from '../HoverDropdown'
import SubmenuItem from './SubmenuItem'

interface SidebarItemProps {
  currentItem: configSidebarType
  index: number
}

const SidebarItem: FC<SidebarItemProps> = ({ currentItem, index }): JSX.Element => {
  const { currentSlidebar } = useLayoutChangeTitle()
  const { isSidebar } = useLayoutSidebar()
  const [isActiveChild, setIsActiveChild] = useState(false)
  const { t } = useTranslation()
  const Icon = currentItem?.icon
  const activeIndex = currentSlidebar?.activeIndex?.[0] ?? -1
  const isActiveParent = activeIndex === index

  return (
    <>
      {!isSidebar && (
        <AccordionWapper
          isUpdate={!!isSidebar}
          callBackUpdate={({ expandAccordion, active, setActive }): void => {
            if (isActiveParent && !active) {
              setActive(!active)
              expandAccordion()
            }
          }}
        >
          {({ active, toggleAccordion, refContent }): JSX.Element => {
            return (
              <>
                <button
                  className={cn(
                    'border-0 !py-0 !mb-1 flex items-center h-[36px] justify-between ',
                    active && 'active'
                  )}
                  onClick={(): void => {
                    toggleAccordion && toggleAccordion()
                  }}
                >
                  <div className="flex items-center gap-2">
                    {Icon ? (
                      <Icon
                        className={active ? 'text-white' : 'group-hover:!text-white'}
                        size={20}
                      />
                    ) : (
                      <Fragment />
                    )}

                    <span
                      className={cn(
                        'ltr:pl-2 rtl:pr-2 !font-semibold dark:text-[#506690] dark:group-hover:text-white-dark',
                        active && 'text-white'
                      )}
                    >
                      {t(`${currentItem?.title}`)}
                    </span>
                  </div>

                  <div className={cn(!active && '-rotate-90')}>
                    <MdOutlineKeyboardArrowDown size={20} />
                  </div>
                </button>

                <SubmenuItem
                  refContent={refContent as React.RefObject<HTMLUListElement>}
                  render={currentItem?.children}
                  isActiveParent={isActiveParent}
                />
              </>
            )
          }}
        </AccordionWapper>
      )}

      {isSidebar && (
        <HoverDropdown
          onShow={(): void => setIsActiveChild(true)}
          onHide={(): void => setIsActiveChild(false)}
          button={
            <button
              className={cn(
                'border-0 !py-0 !mb-1 flex items-center h-[36px] justify-between button_distance_sidebar',
                isActiveParent && 'active',
                isActiveChild && 'active_child'
              )}
            >
              <div className="flex items-center">
                {Icon ? (
                  <Icon
                    className={cn(
                      'shrink-0',
                      isActiveParent ? 'text-white' : 'group-hover:!text-white'
                    )}
                    size={20}
                  />
                ) : (
                  <Fragment />
                )}
              </div>
            </button>
          }
        >
          <SubmenuItem
            isDistanceSidebar
            render={currentItem?.children}
            isActiveParent={isActiveParent}
          />
        </HoverDropdown>
      )}
    </>
  )
}

export default SidebarItem
