import { IObjectParams, IResponsePayload } from '@preload/types'
import { ProxyApi } from '@renderer/apis/proxy'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Proxy } from '@vitechgroup/mkt-proxy-client'
import { queryKeys } from '..'

export const useReadProxyStaticByParams = (
  payload: IObjectParams
): UseQueryResult<IResponsePayload<Proxy[]>, Error> => {
  return useQuery<IResponsePayload<Proxy[]>, Error>({
    queryKey: [queryKeys.proxy.readAllProxyStatic, payload],
    queryFn: async () => {
      const result = await ProxyApi.readProxyByParams(payload)
      if (result.status === 'success') {
        return result.payload as IResponsePayload<Proxy[]>
      }
      throw new Error('Failed to fetch proxy static')
    }
  })
}
