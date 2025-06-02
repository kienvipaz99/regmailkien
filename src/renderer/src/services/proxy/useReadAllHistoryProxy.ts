/* eslint-disable @typescript-eslint/no-explicit-any */
import { IObjectParams, IResponsePayload } from '@preload/types'
import { ProxyApi } from '@renderer/apis/proxy'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Session } from '@vitechgroup/mkt-proxy-client'
import { queryKeys } from '..'

export const useReadAllHistoryProxy = (
  payload: IObjectParams
): UseQueryResult<IResponsePayload<Session[]>, Error> => {
  return useQuery({
    queryKey: [queryKeys.proxy.readAllHistoryProxy],
    queryFn: async () => {
      const result = await ProxyApi.readAllHistoryProxy(payload)
      if (result.status === 'success') {
        return result.payload as any
      } else {
        return
      }
    }
  })
}
