import { cn } from '@renderer/helper'
import type { IFieldFormCustom, WapperLabelFormProps } from '@renderer/types'
import { get } from 'lodash'
import { InputHTMLAttributes } from 'react'
import { IoClose } from 'react-icons/io5'
import ErrorHelperText from './ErrorHelperText'
import WapperLabelForm from './WapperLabelForm'

export interface InputFieldProps<T>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>,
    Omit<WapperLabelFormProps, 'children'>,
    IFieldFormCustom<T> {
  hiddenError?: boolean
  title?: string
  clsTitle?: string
  clsInput?: string
  clsLabelWrapper?: string
  hiddenBgDisabled?: boolean
  isClear?: boolean
  onClear?: () => void
}

const InputField = <T,>({
  formik,
  name,
  label,
  isRequired,
  classWapper,
  isVertical,
  msgError,
  hiddenError,
  clsLabelWrapper,
  isClear,
  clsInput,
  onClear,
  ...spread
}: InputFieldProps<T>): JSX.Element => {
  const newValue = formik ? get(formik?.values, name) : spread.value
  const isShowClear = newValue && isClear

  return (
    <WapperLabelForm
      isRequired={isRequired}
      label={label}
      classWapper={cn(classWapper, isShowClear && '[&>div]:relative')}
      isVertical={isVertical}
      clsLabelWrapper={clsLabelWrapper}
    >
      <input
        autoComplete="off"
        {...spread}
        name={name}
        id={name}
        onChange={formik ? formik.handleChange : spread?.onChange}
        onBlur={formik ? formik.handleBlur : spread?.onBlur}
        value={newValue}
        className={cn(
          'form-input pr-3 focus:border-slate-300 w-full !outline-none',
          clsInput,
          spread?.className,
          spread?.disabled || spread?.readOnly ? 'cursor-default' : '!cursor-text',
          spread?.disabled && 'bg-gray-100',
          !!isShowClear && 'pr-6'
        )}
      />

      {!!isShowClear && (
        <IoClose
          className="absolute top-0 translate-y-1/2 right-1 cursor-pointer text-[#cccccc] select-none"
          onClick={onClear}
          size={20}
        />
      )}

      <ErrorHelperText
        isShow={
          (formik && !hiddenError && get(formik?.touched, name) && get(formik?.errors, name)) ||
          msgError
        }
        msgError={msgError ? msgError : get(formik?.errors, name)}
      />
    </WapperLabelForm>
  )
}

export default InputField
