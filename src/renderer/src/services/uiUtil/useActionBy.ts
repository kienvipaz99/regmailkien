import type { Account, IActionUiUtilBy, IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { UiUtilApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useActionBy = (): UseMutationResult<
  IMainResponse<string[]>,
  Error,
  IFieldUpdateAndCheck<Account, IActionUiUtilBy, string[]>,
  unknown
> => {
  return useMutation({
    mutationFn: UiUtilApi.actionBy,
    onSuccess: (result) => {
      toast[result.status](result.message.key)
    }
  })
}
