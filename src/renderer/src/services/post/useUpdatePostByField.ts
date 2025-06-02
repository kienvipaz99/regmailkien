import type {
  IFieldUpdateAndCheck,
  IMainResponse,
  IPayloadCreateUpdatePost,
  Post
} from '@preload/types'
import { PostApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useUpdatePostByField = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IFieldUpdateAndCheck<Post, IPayloadCreateUpdatePost, string[]>,
  unknown
> => {
  return useMutation({
    mutationFn: PostApi.updatePostByField,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.post.readAll])
      }

      toast[result.status](result.message.key)
    }
  })
}
