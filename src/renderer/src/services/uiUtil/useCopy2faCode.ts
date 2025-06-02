import type { Account, IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { UiUtilApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useCopy2faCode = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IFieldUpdateAndCheck<Account, undefined, string[]>,
  unknown
> => {
  return useMutation({
    mutationFn: UiUtilApi.copy2faCode,
    onSuccess: (result) => {
      toast[result.status](result.message.key)
    }
  })
}
