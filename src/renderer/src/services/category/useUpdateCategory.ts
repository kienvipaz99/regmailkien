import type { IMainResponse } from '@preload/types'
import { CategoryApi } from '@renderer/apis'
import type { ICategoryType, IPayloadUpdateCategory } from '@renderer/types'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { t } from 'i18next'
import { camelCase, join } from 'lodash'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '..'

export const useUpdateCategory = (
  by: ICategoryType
): UseMutationResult<IMainResponse<boolean>, Error, IPayloadUpdateCategory, unknown> => {
  return useMutation({
    mutationFn: CategoryApi.update,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.category[camelCase(join(['read_by', by], '_'))]])
      }
      toast[result.status](t(`${result.message.key}`))
    }
  })
}
