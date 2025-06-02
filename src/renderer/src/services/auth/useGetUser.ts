/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from '@preload/types'
import { AuthApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'

export const useGetUser = (): UseQueryResult<IUser, Error> => {
  return useQuery({
    queryKey: [queryKeys.auth.user],
    queryFn: async () => {
      const result = await AuthApi.getUser()
      if (result.status === 'error') {
        return
      }
      return result.payload?.data as any
    }
  })
}
