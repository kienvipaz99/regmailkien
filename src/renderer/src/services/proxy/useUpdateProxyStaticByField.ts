import { IMainResponse, IPayloadAssignProxy } from '@preload/types'
import { ProxyApi } from '@renderer/apis/proxy'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useUpdateProxyStaticByField = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IPayloadAssignProxy,
  unknown
> => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ProxyApi.updateProxyStaticByField,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.proxy.readAllProxyStatic, queryKeys.account.readAllByParams])
      }
      toast[result.status](t(result.message.key))
    }
  })
}
