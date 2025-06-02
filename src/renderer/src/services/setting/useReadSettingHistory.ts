import type { ITaskTypes } from '@preload/types'
import { SettingApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '..'

export const useReadSettingHistory = (): UseQueryResult<ITaskTypes['action_history'], Error> => {
  return useQuery<ITaskTypes['action_history'], Error>({
    queryKey: [queryKeys.setting.readSettingHistory],
    queryFn: async () => {
      const result = await SettingApi.readSettingBy({ key: 'action_history', select: '' })
      if (result.status === 'success') {
        return result.payload?.data as ITaskTypes['action_history']
      }
      throw new Error('Failed to fetch action history')
    }
  })
}
