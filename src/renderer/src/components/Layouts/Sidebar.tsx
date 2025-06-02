import { ScrollArea, Text } from '@mantine/core'
import type { IUser } from '@preload/types'
import StaticImage from '@renderer/assets/images'
import { configSidebar } from '@renderer/config'
import { useLayoutChangeTitle, useLayoutSidebar } from '@renderer/context'
import { cn } from '@renderer/helper'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { MdOutlineDateRange } from 'react-icons/md'
import { TbVersions } from 'react-icons/tb'
import { Link, NavLink, useLoaderData } from 'react-router-dom'
import { ArrowLeftIcon } from '../Icon'
import SidebarItem from './SidebarItem'

const Sidebar = (): JSX.Element => {
  const { currentSlidebar } = useLayoutChangeTitle()
  const { isSidebar, toggleSlidebar } = useLayoutSidebar()
  const { t } = useTranslation()
  const user = useLoaderData() as IUser

  const remainingDayText = (): string => {
    if (user?.remainingDay !== null && user?.expiresIn !== undefined) {
      if (user.remainingDay > 1000) {
        return t('permanent')
      } else if (user.remainingDay > 365) {
        return t('2_year')
      } else {
        return `${user.remainingDay} ${user.remainingDay > 1 ? t('days') : t('day')}`
      }
    }
    return ''
  }

  const BoxNote = [
    {
      icon: <TbVersions size={18} color="#506690" className="relative top-[2px]" />,
      content: t('install_version'),
      description: import.meta.env.VITE_VERSION_APP
    },
    {
      icon: <MdOutlineDateRange size={18} color="#506690" className="relative top-[2px]" />,
      content: t('day_update'),
      description: import.meta.env.VITE_LAST_UPDATED_APP
    },
    {
      icon: <TbVersions size={18} color="#506690" className="relative top-[2px]" />,
      content: t('remaining_day'),
      description: remainingDayText()
    }
  ]

  return (
    <div>
      <nav
        className={cn(
          `sidebar fixed h-dvh border-r border-t top-0 bottom-0 w-[270px] z-50 duration-200`
        )}
      >
        <div className="bg-white dark:bg-black h-full">
          <div
            className={cn('flex justify-between items-center py-3 ', isSidebar ? 'px-2' : 'px-4')}
          >
            <div className="main-logo flex justify-center items-center shrink-0 w-full pointer-events-none">
              <img
                className={cn('flex-shrink-0 flex-none', isSidebar ? 'w-[55px]' : 'w-[80%]')}
                src={isSidebar ? StaticImage.TableLogo : StaticImage.logoMkt}
                alt="logo"
              />
            </div>

            <button
              type="button"
              className="collapse-icon w-8 h-8 rounded-full flex hover:text-primary items-center hover:font-bold bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
              onClick={() => toggleSlidebar && toggleSlidebar()}
            >
              <ArrowLeftIcon />
            </button>
          </div>

          <ScrollArea
            type="scroll"
            scrollbarSize={8}
            scrollHideDelay={500}
            className={cn(
              'relative sidebar',
              !isSidebar
                ? 'h-[calc(95%_-_330px)] xl:h-[calc(95%_-_335px)] 2xl:h-[calc(95%_-_380px)] max-width-cls'
                : 'h-[calc(95%_-_65px)]'
            )}
          >
            <ul className="relative font-semibold space-y-0.5 p-2 py-0 mt-[35px]">
              {configSidebar?.map((item, index) => {
                const Icon = item?.icon
                const activeIndex = currentSlidebar?.activeIndex?.[0] ?? -1
                const isActive = activeIndex === index

                return (
                  <Fragment key={index}>
                    {item?.isHeader && (
                      <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                        <svg
                          className="w-4 h-5 flex-none hidden"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>{t(`${item?.title}`)}</span>
                      </h2>
                    )}

                    {!item?.isHeader && (
                      <li className={cn('menu nav-item relative', item?.isDisabled && 'disabled')}>
                        {!item?.children ? (
                          <NavLink
                            to={item?.path || ''}
                            className={cn(
                              'border-0 !py-0 !mb-1 flex items-center h-[36px] !justify-start gap-2',
                              item?.isDisabled && 'cursor-not-allowed opacity-50 IDisable'
                            )}
                            aria-disabled={item?.isDisabled}
                          >
                            {Icon && (
                              <Icon
                                className={cn(
                                  'shrink-0',
                                  isActive ? 'text-white' : 'group-hover:!text-white'
                                )}
                                size={20}
                              />
                            )}

                            {!isSidebar && (
                              <span
                                className={cn(
                                  'ltr:pl-2 rtl:pr-2 dark:text-[#506690] dark:group-hover:text-white-dark',
                                  isActive && 'text-white',
                                  item?.isDisabled && 'text-gray-400'
                                )}
                              >
                                {t(`${item?.title}`)}
                              </span>
                            )}
                          </NavLink>
                        ) : (
                          <SidebarItem currentItem={item} index={index} />
                        )}
                      </li>
                    )}
                  </Fragment>
                )
              })}
            </ul>
          </ScrollArea>
          {!isSidebar && (
            <>
              <div className=" bg-cls text-white rounded-full border-0 flex gap-[20px] m-5">
                <img
                  className="flex-none shaker border-0 w-[50px] rounded-full"
                  src={StaticImage.support}
                />
                <div className="flex gap-5 items-center">
                  <Link to={'https://zalo.me/1253076497937607141'} target="_blank">
                    <img className="w-[30px] zoom-in rounded-full" src={StaticImage.zalo} />
                  </Link>
                  <Link
                    to={'https://www.facebook.com/phanmemmkt.vn/?ref=embed_page'}
                    target="_blank"
                  >
                    <img className="w-[30px] zoom-in rounded-full" src={StaticImage.facebook} />
                  </Link>
                  <Link to={'http://phanmemmkt.vn/'} target="_blank">
                    <img className="w-[30px] zoom-in rounded-full" src={StaticImage.web} />
                  </Link>
                </div>
              </div>
              <div className="rounded-[5px] justify-center items-center  p-[8px] relative h-auto shadwo-cls flex flex-col gap-[10px] m-5">
                <div>
                  {BoxNote.map((item, index) => (
                    <Text component="div" className="flex gap-2 items-start py-[4px]" key={index}>
                      {item.icon}
                      <div className="flex flex-col">
                        <p className=" text-[#506690] ">{item.content}</p>
                        <p className="text-center text-[#506690] font-bold">{item.description}</p>
                      </div>
                    </Text>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Sidebar
