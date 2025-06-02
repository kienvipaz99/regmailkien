import type { Account, IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { UiUtilApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useCopyAccountByField = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IFieldUpdateAndCheck<Account, string, string[]>,
  unknown
> => {
  return useMutation({
    mutationFn: UiUtilApi.copyByField,
    onSuccess: (result) => {
      toast[result.status](result.message.key)
    }
  })
}
