/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ISettingAPI } from '@preload/types'
import { SettingApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '..'

export const useReadSettingApi = (): UseQueryResult<ISettingAPI, Error> => {
  return useQuery({
    queryKey: [queryKeys.setting.readSettingApi],
    queryFn: async () => {
      const result = await SettingApi.readSettingBy({ key: 'setting_api', select: '' })
      if (result.status === 'success') {
        return result.payload?.data as any
      } else {
        return
      }
    }
  })
}
