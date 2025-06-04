/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountGmail, IResponsePayload } from '@preload/types'
import { AccountGmailApi } from '@renderer/apis'
import { IObjectParams } from '@renderer/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'

export const useReadAllAccount = (
  payload: IObjectParams
): UseQueryResult<IResponsePayload<AccountGmail[]>, Error> => {
  return useQuery({
    queryKey: [queryKeys.accountGmail.readAll, payload],
    queryFn: async () => {
      const result = await AccountGmailApi.readAll(payload)
      if (result.status === 'success') {
        return result.payload as any
      } else {
        return
      }
    }
  })
}
