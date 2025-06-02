import type { Account, IResponsePayload } from '@preload/types'
import { AccountApi } from '@renderer/apis'
import type { IObjectParams } from '@renderer/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '..'

export const useReadAccountByParams = (
  payload: IObjectParams
): UseQueryResult<IResponsePayload<Account[]>, Error> => {
  return useQuery<IResponsePayload<Account[]>, Error>({
    queryKey: [queryKeys.account.readAllByParams, payload],
    queryFn: async () => {
      const result = await AccountApi.readAccountByParams(payload)
      if (result.status === 'success') {
        return result.payload as IResponsePayload<Account[]>
      }
      throw new Error('Failed to fetch account by params')
    }
  })
}
