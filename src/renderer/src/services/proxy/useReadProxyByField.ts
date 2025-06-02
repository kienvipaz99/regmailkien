import { IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { ProxyApi } from '@renderer/apis/proxy'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import type { Proxy } from '@vitechgroup/mkt-proxy-client'

export const useReadProxyByField = (): UseMutationResult<
  IMainResponse<Proxy[]>,
  Error,
  IFieldUpdateAndCheck<Proxy, undefined, string[]>[],
  unknown
> => {
  return useMutation({
    mutationFn: ProxyApi.readProxyByField
  })
}
