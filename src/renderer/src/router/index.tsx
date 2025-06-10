import type { IUser } from '@preload/types'
import { AuthApi } from '@renderer/apis'
import { DefaultLayout, LayoutAuth } from '@renderer/components'
import LayoutAuthProvider from '@renderer/context/LayoutAuthProvider'
import { createHashRouter } from 'react-router-dom'
import { CustomRouteConfig, layoutType, routes } from './routes'

const checkLayout = (route: CustomRouteConfig): React.ReactNode => {
  if (route?.layout) {
    switch (route.layout) {
      case layoutType.auth:
        return <LayoutAuth>{route.element}</LayoutAuth>
      default:
        return <DefaultLayout>{route.element}</DefaultLayout>
    }
  }
  return <DefaultLayout>{route.element}</DefaultLayout>
}

const finalRoutes = routes.map((route) => {
  return {
    ...route,
    loader: async (): Promise<IUser | null> =>
      await AuthApi.getUser()
        .then((result) => result.payload?.data ?? null)
        .catch(() => null),
    element: <LayoutAuthProvider>{checkLayout(route)}</LayoutAuthProvider>
  }
})

const router = createHashRouter(finalRoutes)

export default router
