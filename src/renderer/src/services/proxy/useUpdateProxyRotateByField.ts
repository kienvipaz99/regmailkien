import { IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { ProxyApi } from '@renderer/apis/proxy'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { Proxy } from '@vitechgroup/mkt-proxy-client'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useUpdateProxyRotateByField = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IFieldUpdateAndCheck<Proxy, Partial<Proxy>, string[]>,
  unknown
> => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ProxyApi.updateProxyRotateByField,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.proxy.readAllKeyProxy])
      }
      toast[result.status](t(result.message.key))
    }
  })
}
