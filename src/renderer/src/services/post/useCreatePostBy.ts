import type { IMainResponse, IPayloadCreateUpdatePost } from '@preload/types'
import { PostApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useCreatePostBy = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IPayloadCreateUpdatePost,
  unknown
> => {
  return useMutation({
    mutationFn: PostApi.create,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.post.readAll])
      }

      toast[result.status](result.message.key)
    }
  })
}
