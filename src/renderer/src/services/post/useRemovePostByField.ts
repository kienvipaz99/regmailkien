import type { IFieldUpdateAndCheck, IMainResponse, Post } from '@preload/types'
import { PostApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useRemovePostByField = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IFieldUpdateAndCheck<Post, undefined, string[]>,
  unknown
> => {
  return useMutation({
    mutationFn: PostApi.removeByField,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.post.readAll])
      }

      toast[result.status](result.message.key)
    }
  })
}
