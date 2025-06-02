import { Switch, SwitchProps } from '@mantine/core'
import { cn } from '@renderer/helper'
import type { IFieldFormCustom } from '@renderer/types'
import { get } from 'lodash'
import { useId } from 'react'
import ErrorHelperText from './ErrorHelperText'

type CheckBoxFieldProps<T> = SwitchProps &
  IFieldFormCustom<T> & {
    label?: string
    classWapper?: string
    classCheckBox?: string
    classNameLabel?: string
  }

const SwitchField = <T,>({
  formik,
  name,
  msgError,
  label,
  color = 'blue',
  classWapper,
  classCheckBox,
  labelPosition,
  classNameLabel,
  ...spread
}: CheckBoxFieldProps<T>): JSX.Element => {
  const idCheck = useId()
  const value = formik ? get(formik?.values, name) : spread?.value
  const isBoolean = typeof spread?.value === 'undefined'

  return (
    <div className={cn(classWapper)}>
      <div
        className={cn(
          'flex items-center',
          classCheckBox,
          color,
          labelPosition === 'left' && '[&>:first-child]:order-1'
        )}
      >
        <Switch
          id={idCheck}
          name={name}
          color={color}
          onChange={(): void => {
            formik?.setFieldValue(name, isBoolean ? !value : spread?.value)
          }}
          onBlur={formik?.handleBlur}
          checked={isBoolean ? !!value : value === spread?.value}
          className="!cursor-pointer"
          {...spread}
        />
        {label && (
          <label
            htmlFor={idCheck}
            className={cn(
              'text-sm font-medium text-gray-900 ',
              spread?.disabled ? 'cursor-default' : '!cursor-pointer',
              labelPosition === 'left' ? 'pr-2' : 'pl-2',
              classNameLabel
            )}
          >
            {label}
          </label>
        )}
      </div>
      <ErrorHelperText
        isShow={(formik && get(formik?.touched, name) && get(formik?.errors, name)) || msgError}
        msgError={msgError ? msgError : get(formik?.errors, name)}
      />
    </div>
  )
}

export default SwitchField
