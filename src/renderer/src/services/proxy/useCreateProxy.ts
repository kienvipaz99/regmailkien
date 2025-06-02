import { IMainResponse, IPayloadCreateProxy } from '@preload/types'
import { ProxyApi } from '@renderer/apis/proxy'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useCreateProxy = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IPayloadCreateProxy,
  unknown
> => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ProxyApi.create,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.proxy.readAllProxyStatic])
      }

      toast[result.status](t(result.message.key))
    }
  })
}
