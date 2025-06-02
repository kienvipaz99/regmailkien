import type { IMainResponse, IPayloadStartAction } from '@preload/types'
import { ActionApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { t } from 'i18next'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useStartAction = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IPayloadStartAction,
  unknown
> => {
  return useMutation({
    mutationFn: ActionApi.startAction,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.setting.readSettingHistory])
      }
      toast[result.status](t(`${result.message.key}`))
    }
  })
}
