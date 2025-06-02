import type { Account, IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { AccountApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useRemoveAccountByField = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IFieldUpdateAndCheck<Account, undefined, string[] | boolean>[],
  unknown
> => {
  return useMutation({
    mutationFn: AccountApi.removeByField,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.account.readAllByParams])
      }
      toast[result.status](result.message.key)
    }
  })
}
