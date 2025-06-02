/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { IResponsePayload } from '@preload/types'
import { UseQueryResult } from '@tanstack/react-query'
import { uniqBy } from 'lodash'
import { useCallback, useEffect, useState } from 'react'

export type optionSelect = {
  label: string | number
  value: any
  originValue?: any
}

export interface useSelectProps<T> {
  limit?: number
  page?: number
  callApi: (obj: { limit: number; page: number }) => UseQueryResult<T, Error>
  renderOption: (data: T) => optionSelect[]
}

const useSelect = <T>({ callApi, renderOption, page = 1, limit = 150 }: useSelectProps<T>) => {
  const [configPagination, setConfigPagination] = useState({
    page,
    limit
  })
  const [options, setOptions] = useState<optionSelect[]>([])
  const { data, isFetched, isFetching, ...spread } = callApi(configPagination)

  useEffect(() => {
    if (data && !isFetching) {
      const newOtp = renderOption(data)

      if (configPagination.page === 1) {
        // Nếu là trang đầu tiên, reset lại toàn bộ options
        setOptions(newOtp)
      } else {
        // Nếu không, thêm dữ liệu vào options hiện tại
        setOptions((prev) => uniqBy([...prev, ...newOtp], 'value'))
      }
    }
  }, [isFetched, data, isFetching, configPagination.page])

  const setPaginationScroll = useCallback(() => {
    if (
      data &&
      (data as unknown as IResponsePayload<any>)?.page <
        (data as unknown as IResponsePayload<any>)?.total
    ) {
      setConfigPagination((prev) => ({
        ...prev,
        page: prev.page + 1
      }))
    }
  }, [isFetched])

  return {
    options,
    setOptions,
    setConfigPagination,
    setPaginationScroll,
    renderOption,
    configPagination,
    data,
    isFetched,
    isFetching,
    ...spread
  }
}

export { useSelect }
