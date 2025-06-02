import { SelectField } from '@renderer/components'
import { getValueSelected } from '@renderer/helper'
import { useSelect } from '@renderer/hook'
import { useReadCategoryByParamsFrom } from '@renderer/services'
import type { refSelect, SelectScrollBaseProps } from '@renderer/types'
import { unionBy } from 'lodash'
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'

const SelectScrollCategory: ForwardRefRenderFunction<refSelect, SelectScrollBaseProps> = (
  {
    name = 'category',
    label = '',
    placeholder = 'select_category',
    params,
    type = 'account',
    funCustomValue,
    ...spread
  },
  ref
) => {
  const { t } = useTranslation()

  const { options, setOptions, renderOption, setPaginationScroll, isFetching } = useSelect({
    callApi: ({ limit, page }) =>
      useReadCategoryByParamsFrom(type, {
        page,
        pageSize: limit,
        category_type: type,
        ...(params ?? {})
      }),
    renderOption: (result) => {
      return (
        result?.data?.map((item) => ({
          label: item?.name,
          value: item?.id,
          originValue: item
        })) ?? []
      )
    }
  })

  useImperativeHandle(ref, () => {
    return {
      setOptions,
      options,
      renderOptionUniq: (data): void => {
        const newData = data && Array.isArray(data) ? data : [data]
        const currentOption = renderOption({
          total: 0,
          data: newData,
          pageSize: 0,
          page: 0,
          dies: 0,
          lives: 0
        })
        setOptions((prev) => unionBy([...prev, ...currentOption], 'value'))
      }
    }
  }, [setOptions, options])

  return (
    <SelectField
      label={label}
      name={name}
      options={options ?? []}
      classWapper="flex-1"
      placeholder={t(`${placeholder}`)}
      isLoading={isFetching}
      onMenuScrollToBottom={setPaginationScroll}
      {...spread}
      value={
        spread?.formik
          ? undefined
          : funCustomValue
            ? funCustomValue(spread?.value, options)
            : getValueSelected(spread?.value, options)
      }
    />
  )
}

export default forwardRef(SelectScrollCategory)
