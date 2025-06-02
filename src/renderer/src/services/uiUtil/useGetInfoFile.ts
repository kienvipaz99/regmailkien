import type { IInfoFile, IMainResponse } from '@preload/types'
import { UiUtilApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'

export const useGetInfoFile = (): UseMutationResult<
  IMainResponse<IInfoFile>,
  Error,
  string,
  unknown
> => {
  return useMutation({
    mutationFn: UiUtilApi.getInfoFile
  })
}
