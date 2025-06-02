// import type { IMainResponse } from '@preload/types'
// import { AuthApi } from '@renderer/apis'
// import { configStatic } from '@renderer/config/static'
// import { useMutation, UseMutationResult } from '@tanstack/react-query'
// import type { ILogin } from '@vitechgroup/mkt-key-client'
// import { t } from 'i18next'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'

// export const useAuthLogin = (
//   hideToast?: boolean
// ): UseMutationResult<IMainResponse<boolean>, Error, ILogin, unknown> => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   // const { handleCheckShowBannerOrRules } = useLayoutBannerRules()

//   return useMutation({
//     mutationFn: AuthApi.loginTool,
//     onSuccess: (result) => {
//       if (result.status === 'success') {
//         // navigate(configStatic.router.home)
//         navigate(configStatic.router.scanMapKey)
//       } else {
//         if (!(location.pathname === configStatic.router.login)) {
//           navigate(configStatic.router.login)
//         }
//       }

//       !hideToast && toast[result.status](t(`notifications.${result.message.key}`))
//     }
//   })
// }
