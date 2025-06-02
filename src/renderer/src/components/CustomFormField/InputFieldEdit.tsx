import { cn } from '@renderer/helper'
import type { IFieldFormCustom, WapperLabelFormProps } from '@renderer/types'
import { get } from 'lodash'
import { InputHTMLAttributes } from 'react'
import { IoMdClose } from 'react-icons/io'
import ErrorHelperText from './ErrorHelperText'
import WapperLabelForm from './WapperLabelForm'

export interface InputFieldEditProps<T>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>,
    Omit<WapperLabelFormProps, 'children'>,
    IFieldFormCustom<T> {
  hiddenError?: boolean
  title?: string
  clsTitle?: string
  clsLabelWrapper?: string
  hiddenBgDisabled?: boolean
  clear?: boolean
  clsLayout?: string
  clsInput?: string
  onClear?: () => void
}

const InputFieldEdit = <T,>({
  formik,
  name,
  label,
  isRequired,
  classWapper,
  isVertical,
  msgError,
  hiddenError,
  title,
  clsLabelWrapper,
  clsTitle,
  clear,
  clsLayout,
  onClear,
  clsInput,
  ...spread
}: InputFieldEditProps<T>): JSX.Element => {
  return (
    <WapperLabelForm
      isRequired={isRequired}
      label={label}
      classWapper={classWapper}
      isVertical={isVertical}
      clsLabelWrapper={clsLabelWrapper}
    >
      <div className={`${clsLayout} flex items-center gap-3`}>
        {title && (
          <p className={`${clsTitle} whitespace-nowrap text-sm font-medium text-gray-900`}>
            {title}
          </p>
        )}
        <div className="relative w-full">
          <input
            autoComplete="off"
            {...spread}
            name={name}
            id={name}
            onChange={formik ? formik.handleChange : spread?.onChange}
            onBlur={formik ? formik.handleBlur : spread?.onBlur}
            value={formik ? get(formik.values, name) : spread.value}
            className={cn(
              'form-input pr-3 focus:border-slate-300 w-full !outline-none !cursor-default',
              spread?.className,
              spread?.disabled && ' bg-gray-100',
              clsInput
            )}
          />
          {clear && (
            <span
              onClick={onClear}
              className="text-sm absolute right-[15px] top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <IoMdClose />
            </span>
          )}
        </div>
      </div>
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

export default InputFieldEdit
