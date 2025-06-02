/* eslint-disable @typescript-eslint/no-explicit-any */
import { IObjectParams, IResponsePayload } from '@preload/types'
import { ProxyApi } from '@renderer/apis/proxy'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Proxy } from '@vitechgroup/mkt-proxy-client'
import { queryKeys } from '..'

export const useReadProxyRotateByParams = (
  payload: IObjectParams
): UseQueryResult<IResponsePayload<Proxy[]>, Error> => {
  return useQuery({
    queryKey: [queryKeys.proxy.readAllKeyProxy, payload],
    queryFn: async () => {
      const result = await ProxyApi.readProxyByParams(payload)
      if (result.status === 'success') {
        return result.payload as any
      } else {
        return
      }
    }
  })
}
