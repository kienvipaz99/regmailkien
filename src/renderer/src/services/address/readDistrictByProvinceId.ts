/* eslint-disable @typescript-eslint/no-explicit-any */
import { District, IObjectParams, IResponsePayload } from '@preload/types'
import { AddressApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'

export const readDistrictByProvinceId = (
  payload: IObjectParams
): UseQueryResult<IResponsePayload<District[]>, Error> => {
  return useQuery<IResponsePayload<District[]>, Error>({
    queryKey: [queryKeys.address.readAllDistrict, payload.provinceId],
    queryFn: async () => {
      const result = await AddressApi.readDistrictByProvinceId(payload)
      if (result.status === 'success') {
        return result.payload as IResponsePayload<District[]>
      }
      throw new Error('Failed to fetch districts')
    },
    enabled: !!payload.provinceId
  })
}
