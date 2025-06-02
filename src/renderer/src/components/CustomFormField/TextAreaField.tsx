import { cn } from '@renderer/helper'
import type { WapperLabelFormProps } from '@renderer/types'
import { FormikProps } from 'formik'
import { get } from 'lodash'
import { TextareaHTMLAttributes } from 'react'
import ErrorHelperText from './ErrorHelperText'
import WapperLabelForm from './WapperLabelForm'

interface TextAreaFieldProps<T>
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    Omit<WapperLabelFormProps, 'children'> {
  name: string
  clsTextArea?: string
  clsLabelWrapper?: string
  formik?: FormikProps<T>
  msgError?: string
}

const TextAreaField = <T,>({
  formik,
  name,
  label,
  isRequired,
  classWapper,
  isVertical,
  msgError,
  clsTextArea,
  clsLabelWrapper,
  ...spread
}: TextAreaFieldProps<T>): JSX.Element => {
  return (
    <WapperLabelForm
      isRequired={isRequired}
      label={label}
      classWapper={classWapper}
      isVertical={isVertical}
      clsLabelWrapper={clsLabelWrapper}
    >
      <textarea
        autoComplete="off"
        {...spread}
        name={name}
        id={name}
        onChange={formik ? formik.handleChange : spread?.onChange}
        onBlur={formik ? formik.handleBlur : spread?.onBlur}
        value={formik ? get(formik?.values, name) : spread.value}
        className={cn(
          clsTextArea,
          `form-textarea pr-9 focus:border-slate-300 w-full !outline-none`,
          spread?.className,
          spread?.disabled && '!cursor-default bg-gray-100'
        )}
      />
      <ErrorHelperText
        isShow={(formik && get(formik?.touched, name) && get(formik?.errors, name)) || msgError}
        msgError={msgError ? msgError : get(formik?.errors, name)}
      />
    </WapperLabelForm>
  )
}

export default TextAreaField
