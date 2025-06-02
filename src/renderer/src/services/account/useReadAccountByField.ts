/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Account, IFieldUpdateAndCheck } from '@preload/types'
import { AccountApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

export const useReadAccountByField = (
  payload: IFieldUpdateAndCheck<Account, undefined, string[] | boolean>[]
): UseQueryResult<Account[], Error> => {
  return useQuery({
    queryKey: [payload],
    queryFn: async () => {
      const result = await AccountApi.readAccountByField(payload)
      if (result.status === 'success') {
        return result.payload?.data as any
      } else {
        return
      }
    }
  })
}
