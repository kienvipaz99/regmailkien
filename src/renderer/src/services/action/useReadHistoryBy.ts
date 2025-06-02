import type { IPayloadReadHistory } from '@preload/types'
import { ActionApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import type { JobDetail } from '@vitechgroup/mkt-job-queue'
import { queryKeys } from '..'

export const useReadHistoryBy = (
  payload: IPayloadReadHistory
): UseQueryResult<JobDetail[], Error> => {
  return useQuery({
    queryKey: [queryKeys.action.readHistoryBy, payload],
    queryFn: async () => {
      const result = await ActionApi.readHistoryBy(payload)
      return result.payload?.data ?? []
    }
  })
}
