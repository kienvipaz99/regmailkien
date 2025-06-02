import type { AppSettings, IFieldUpdateAndCheck } from '@preload/types'
import { SettingApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '..'

export const useReadActionBy = <T>(
  payload: IFieldUpdateAndCheck<AppSettings, undefined, string>
): UseQueryResult<T, Error> => {
  return useQuery<T, Error>({
    queryKey: [queryKeys.action.readActionBy, payload],
    queryFn: async () => {
      const result = await SettingApi.readSettingBy(payload)
      if (result.status === 'success') {
        return result.payload?.data as T
      }
      return {} as T
    }
  })
}
