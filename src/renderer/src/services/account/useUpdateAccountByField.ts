import type { Account, IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { AccountApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { t } from 'i18next'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useUpdateAccountByField = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IFieldUpdateAndCheck<Account, Partial<Account>, string[]>,
  unknown
> => {
  return useMutation({
    mutationFn: AccountApi.updateAccountByField,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.account.readAllByParams])
      }
      toast[result.status](t(`${result.message.key}`))
    }
  })
}
