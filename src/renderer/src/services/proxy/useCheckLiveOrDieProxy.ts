import { IMainResponse } from '@preload/types'
import { ProxyApi } from '@renderer/apis/proxy'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { IResponseCheckLiveDie } from '@vitechgroup/mkt-proxy-client'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useCheckLiveOrDieProxy = (): UseMutationResult<
  IMainResponse<IResponseCheckLiveDie[]>,
  Error,
  string[],
  unknown
> => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ProxyApi.checkLiveOrDieProxy,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.proxy.readAllProxyStatic])
      }

      toast[result.status](t(result.message.key))
    }
  })
}
