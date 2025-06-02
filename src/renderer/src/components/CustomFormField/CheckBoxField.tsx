import { Checkbox, CheckboxProps } from '@mantine/core'
import { cn } from '@renderer/helper'
import type { IFieldFormCustom } from '@renderer/types'
import { get } from 'lodash'
import { ReactNode, useId } from 'react'
import { useTranslation } from 'react-i18next'
import ErrorHelperText from './ErrorHelperText'

export type CheckBoxFieldProps<T> = CheckboxProps &
  IFieldFormCustom<T> & {
    label?: ReactNode
    classWapper?: string
    classCheckBox?: string
    onChangeValue?: () => void
    classLabel?: string
  }

const CheckBoxField = <T,>({
  formik,
  name,
  msgError,
  label,
  classLabel,
  color = 'indigo',
  classWapper,
  classCheckBox,
  onChangeValue,
  ...spread
}: CheckBoxFieldProps<T>): JSX.Element => {
  const idCheck = useId()
  const values = get(formik?.values, name)
  const { t } = useTranslation()

  return (
    <div className={cn(classWapper)}>
      <div className={cn('flex items-center', classCheckBox, color)}>
        <Checkbox
          id={idCheck}
          name={name}
          color={color}
          onChange={(): void => {
            if (Array.isArray(values)) {
              let newValue = [...values]
              if (newValue?.includes(spread?.value)) {
                newValue = newValue?.filter((value) => value !== spread?.value)
              } else {
                newValue.push(spread?.value)
              }
              formik?.setFieldValue(name, newValue)
            } else {
              formik?.setFieldValue(name, !values)
            }
            onChangeValue && onChangeValue()
          }}
          onBlur={formik?.handleBlur}
          checked={Array.isArray(values) ? (values ?? [])?.includes(spread?.value) : !!values}
          {...spread}
        />

        {label && (
          <label
            htmlFor={idCheck}
            className={cn(
              'pl-2 text-sm font-medium',
              spread?.disabled ? 'cursor-default text-[#c1c1c1]' : 'cursor-pointer text-gray-900',
              classLabel ? classLabel : ''
            )}
          >
            {typeof label === 'string' ? t(label) : label}
          </label>
        )}
      </div>
      <ErrorHelperText
        isShow={(formik && get(formik?.touched, name) && get(formik?.errors, name)) || msgError}
        msgError={msgError ? msgError : (formik?.errors as unknown)?.[name]}
      />
    </div>
  )
}

export default CheckBoxField
