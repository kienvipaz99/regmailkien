/* eslint-disable @typescript-eslint/no-explicit-any */
import { SettingApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '..'

export const useReadStatusDownload = <T>(by: 'check_browser'): UseQueryResult<T, Error> => {
  return useQuery({
    queryKey: [queryKeys.action.readStatusDownload],
    queryFn: async () => {
      const result = await SettingApi.readSettingBy({ key: by, select: '' })
      if (result.status === 'success') {
        return result.payload?.data as any
      } else {
        return
      }
    }
  })
}
