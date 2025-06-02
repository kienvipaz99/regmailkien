import type { IMainResponse, IPayloadShowDialog } from '@preload/types'
import { UiUtilApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { t } from 'i18next'
import { toast } from 'react-toastify'

export const useShowDialog = (): UseMutationResult<
  IMainResponse<string[] | string>,
  Error,
  IPayloadShowDialog,
  unknown
> => {
  return useMutation({
    mutationFn: UiUtilApi.showDialog,
    onSuccess: (result) => {
      toast[result.status](t(`${result.message.key}`))
    }
  })
}
