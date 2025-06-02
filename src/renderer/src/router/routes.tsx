import { configStatic } from '@renderer/config/static'
import { ManagerAccount } from '@renderer/pages'
import { HistoryProxy, ManagerStaticsProxy, ProxyDynamic } from '@renderer/pages/ManagerProxy'
import ScanMapKey from '@renderer/pages/ScanMapKey'
import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom'

export enum layoutType {
  auth = 'auth',
  blank = 'blank'
}

type CustomRouteObjectParams = {
  layout?: layoutType | ''
}

export type CustomIndexRouteObject = IndexRouteObject & CustomRouteObjectParams

export type CustomNonIndexRouteObject = Omit<NonIndexRouteObject, 'children'> &
  CustomRouteObjectParams & {
    children?: (CustomIndexRouteObject | CustomNonIndexRouteObject)[]
  }

export type CustomRouteConfig = CustomIndexRouteObject | CustomNonIndexRouteObject

const routes: CustomRouteConfig[] = [
  // {
  //   path: configStatic.router.login,
  //   element: <Login />,
  //   layout: layoutType.auth
  // },
  {
    path: '/',
    element: <ScanMapKey />
  },
  {
    path: configStatic.router.home,
    element: <ManagerAccount />,
    layout: layoutType.blank
  },
  {
    path: configStatic.router.scanMapKey,
    element: <ScanMapKey />
  },
  {
    element: <ManagerStaticsProxy />,
    path: configStatic.router.ManagerStaticProxy
  },
  {
    element: <ProxyDynamic />,
    path: configStatic.router.ProxyDynamic
  },
  {
    element: <HistoryProxy />,
    path: configStatic.router.HistoryWorkProxy
  }
]

export { routes }
