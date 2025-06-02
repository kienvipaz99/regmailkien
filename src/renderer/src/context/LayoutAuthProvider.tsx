import { registerEventListeners, removeEventListeners, type IUser } from '@preload/types'
import { useLayoutBannerRules } from '@renderer/context/LayoutBannerRules'
import { queriesToInvalidate, queryKeys } from '@renderer/services'
import { IAuthContext } from '@renderer/types'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import { useLoaderData } from 'react-router-dom'

const AuthContext = createContext<IAuthContext>({})

const LayoutAuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const user = useLoaderData() as IUser
  const { handleCheckShowBannerOrRules } = useLayoutBannerRules()

  useEffect(() => {
    handleCheckShowBannerOrRules && handleCheckShowBannerOrRules()

    if (user) {
      // const pathName = window.location.pathname
      // login({
      //   password: user?.password,
      //   username: user?.email
      // })
      // if (!(pathName === '/' || pathName.startsWith(configStatic.router.login))) {
      //   handleCheckShowBannerOrRules && handleCheckShowBannerOrRules()
      // }
      // return
    }

    registerEventListeners('auto_login_success', () => {
      queriesToInvalidate([queryKeys.auth.user])
    })

    return removeEventListeners(['auto_login_success'])
  }, [])

  const values = useMemo<IAuthContext>(() => {
    return {
      user
    }
  }, [user])

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export const useAuthProvider = (): IAuthContext => {
  return useContext(AuthContext)
}

export default LayoutAuthProvider
