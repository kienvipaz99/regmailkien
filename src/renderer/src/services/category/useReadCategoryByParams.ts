/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Category, IResponsePayload } from '@preload/types'
import { CategoryApi } from '@renderer/apis'
import type { ICategoryType, IObjectParams } from '@renderer/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { camelCase, join } from 'lodash'
import { queryKeys } from '..'

export const useReadCategoryByParamsFrom = (
  from: ICategoryType,
  payload: IObjectParams
): UseQueryResult<IResponsePayload<Category[]>, Error> => {
  return useQuery({
    queryKey: [queryKeys.category[camelCase(join(['read_by', from], '_'))], payload],
    queryFn: async () => {
      const result = await CategoryApi.readCategoryByParams(payload)
      if (result.status === 'success') {
        return result.payload as any
      } else {
        return
      }
    }
  })
}
