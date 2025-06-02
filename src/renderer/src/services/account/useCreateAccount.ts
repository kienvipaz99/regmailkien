import type { IMainResponse } from '@preload/types'
import { AccountApi } from '@renderer/apis'
import type { IPayloadCreateAccount } from '@renderer/types'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { t } from 'i18next'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useCreateAccount = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IPayloadCreateAccount,
  unknown
> => {
  return useMutation({
    mutationFn: AccountApi.create,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([
          queryKeys.account.readAllByParams,
          queryKeys.account.counterTotalLiveAndDie
        ])
      }

      toast[result.status](t(`${result.message.key}`))
    }
  })
}
