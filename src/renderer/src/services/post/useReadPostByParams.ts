/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IResponsePayload, Post } from '@preload/types'
import { PostApi } from '@renderer/apis'
import type { IObjectParams } from '@renderer/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '..'

export const useReadPostByParams = (
  payload: IObjectParams
): UseQueryResult<IResponsePayload<Post[]>, Error> => {
  return useQuery({
    queryKey: [queryKeys.post.readAll, payload],
    queryFn: async () => {
      const result = await PostApi.readPostByParams(payload)
      if (result.status === 'success') {
        return result.payload as any
      } else {
        return
      }
    }
  })
}
