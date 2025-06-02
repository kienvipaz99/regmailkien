/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ISettingProxy } from '@preload/types'
import { SettingApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '..'

export const useReadSettingProxy = (): UseQueryResult<ISettingProxy, Error> => {
  return useQuery({
    queryKey: [queryKeys.setting.readSettingProxy],
    queryFn: async () => {
      const result = await SettingApi.readSettingBy({ key: 'setting_proxy', select: '' })
      console.log(result, 'result')

      if (result.status === 'success') {
        return result.payload?.data as any
      } else {
        return
      }
    }
  })
}
