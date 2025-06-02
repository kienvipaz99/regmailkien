import type { IResponsePayload } from '@preload/types'
import { AccountApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '..'

export const useCounterTotalLiveAndDie = (): UseQueryResult<IResponsePayload<boolean>, Error> => {
  return useQuery<IResponsePayload<boolean>, Error>({
    queryKey: [queryKeys.account.counterTotalLiveAndDie],
    queryFn: async () => {
      const result = await AccountApi.counterTotalLiveAndDie()
      if (result.status === 'success') {
        return result.payload as IResponsePayload<boolean>
      }
      throw new Error('Failed to fetch counter total')
    }
  })
}
