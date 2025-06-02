import { Config } from 'driver.js'
import { ReactNode } from 'react'
import { BiSolidDashboard } from 'react-icons/bi'

import { SiTraefikproxy } from 'react-icons/si'
import { TbMapSearch } from 'react-icons/tb'
import { configStatic } from './static'

export interface configItemSidebar {
  path?: string
  title?: string
  isHeader?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: (prop?: any) => ReactNode
  configTourSteps?: Config['steps']
  isDisabled?: boolean
}

export interface configSidebarType extends configItemSidebar {
  children?: configItemSidebar[]
}

export const configSidebar: configSidebarType[] = [
  {
    path: configStatic.router.home,
    title: 'manager_account',
    icon: BiSolidDashboard,
    isDisabled: true
  },
  {
    title: 'manager_proxy',
    icon: SiTraefikproxy,
    children: [
      // {
      //   title: 'manager_proxy_static',
      //   path: configStatic.router.ManagerStaticProxy
      // },
      {
        title: 'config_proxy_dynamic',
        path: configStatic.router.ProxyDynamic
      },
      {
        title: 'history_proxy',
        path: configStatic.router.HistoryWorkProxy
      }
    ]
  },

  // {
  //   path: configStatic.router.contentManagement,
  //   title: 'manager_content',
  //   icon: SiContentstack
  // },
  {
    path: configStatic.router.scanMapKey,
    title: 'create_account',
    icon: TbMapSearch,
    children: [
      {
        path: configStatic.router.scanMapKey,
        title: 'create_account'
      }
    ]
  }
]

export default configSidebar
