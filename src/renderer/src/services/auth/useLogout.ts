// import { IMainResponse } from '@preload/types'
// import { AuthApi } from '@renderer/apis'
// import { configStatic } from '@renderer/config/static'
// import { useMutation, UseMutationResult } from '@tanstack/react-query'
// import { useNavigate } from 'react-router-dom'

// export const useLogout = (): UseMutationResult<IMainResponse<boolean>, Error, void, unknown> => {
//   const navigate = useNavigate()

//   return useMutation({
//     mutationFn: AuthApi.logoutTool,
//     onSuccess: () => {
//       navigate(configStatic.router.login)
//     }
//   })
// }
