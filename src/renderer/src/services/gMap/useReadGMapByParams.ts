/* eslint-disable @typescript-eslint/no-explicit-any */
import { IResponsePayload, Maps } from '@preload/types'
import { GMapApi } from '@renderer/apis'
import { IObjectParams } from '@renderer/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'

export const useReadGMapByParams = (
  payload: IObjectParams
): UseQueryResult<IResponsePayload<Maps[]>, Error> => {
  return useQuery({
    queryKey: [queryKeys.gMap.readAllByParams, payload],
    queryFn: async () => {
      const result = await GMapApi.readAllByParams(payload)
      if (result.status === 'success') {
        return result.payload as any
      } else {
        return
      }
    }
  })
}
