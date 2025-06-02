import type { ISettingSystem } from '@preload/types'
import { SettingApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '..'

export const useReadSettingSystem = (): UseQueryResult<ISettingSystem, Error> => {
  return useQuery<ISettingSystem, Error>({
    queryKey: [queryKeys.setting.readSettingSystem],
    queryFn: async () => {
      const result = await SettingApi.readSettingBy({ key: 'setting_system', select: '' })
      if (result.status === 'success') {
        return result.payload?.data as ISettingSystem
      }
      throw new Error('Failed to fetch setting system')
    }
  })
}
