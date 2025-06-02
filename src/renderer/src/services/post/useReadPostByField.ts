/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IFieldUpdateAndCheck, Post } from '@preload/types'
import { PostApi } from '@renderer/apis'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '..'

export const useReadPostByField = (
  payload: IFieldUpdateAndCheck<Post, undefined, string[]>[]
): UseQueryResult<Post[], Error> => {
  return useQuery({
    queryKey: [queryKeys.post.readAll, payload],
    queryFn: async () => {
      const result = await PostApi.readPostByField(payload)
      if (result.status === 'success') {
        return result.payload?.data as any
      } else {
        return
      }
    }
  })
}
