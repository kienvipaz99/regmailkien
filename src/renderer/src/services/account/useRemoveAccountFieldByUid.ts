import type { Account, IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { AccountApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useRemoveAccountFieldByUid = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IFieldUpdateAndCheck<Account, Array<keyof Account>, string[]>,
  unknown
> => {
  return useMutation({
    mutationFn: AccountApi.removeFieldByUid,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.account.readAllByParams])
      }
      toast[result.status](result.message.key)
    }
  })
}
