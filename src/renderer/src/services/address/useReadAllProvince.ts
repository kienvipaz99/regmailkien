/* eslint-disable @typescript-eslint/no-explicit-any */
import { IResponsePayload, Province } from '@preload/types'
import { AddressApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'

export const useReadAllProvince = (): UseQueryResult<IResponsePayload<Province[]>, Error> => {
  return useQuery({
    queryKey: [queryKeys.address.readAllProvince],
    queryFn: async () => {
      const result = await AddressApi.readAllProvince()
      console.log('🚀 ~ queryFn: ~ result:', result)
      if (result.status === 'success') {
        return result.payload as any
      } else {
        return
      }
    }
  })
}
