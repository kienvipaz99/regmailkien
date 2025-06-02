import type { Account, IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { AccountApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useUpdateByClipboard = (): UseMutationResult<
  IMainResponse<string[]>,
  Error,
  IFieldUpdateAndCheck<Account, string[], keyof Account>,
  unknown
> => {
  return useMutation({
    mutationFn: AccountApi.updateByClipboard,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.account.readAllByParams])
      }
      toast[result.status](result.message.key)
    }
  })
}
