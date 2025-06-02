import type { Category, IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { CategoryApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'

export const useReadCategoryByField = (): UseMutationResult<
  IMainResponse<Category[]>,
  Error,
  IFieldUpdateAndCheck<Category, undefined, string>[],
  unknown
> => {
  return useMutation({
    mutationFn: CategoryApi.readCategoryByField
  })
}
