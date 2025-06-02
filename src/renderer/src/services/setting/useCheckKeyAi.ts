import type { IMainResponse, IPayloadCheckAi, IStatusCheckAi } from '@preload/types'
import { SettingApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useCheckKeyAi = (): UseMutationResult<
  IMainResponse<IStatusCheckAi | null>,
  Error,
  IPayloadCheckAi,
  unknown
> => {
  return useMutation({
    mutationFn: SettingApi.checkKeyAi,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.setting.readSettingApi])
      }

      toast[result.status](result.message.key)
    }
  })
}
