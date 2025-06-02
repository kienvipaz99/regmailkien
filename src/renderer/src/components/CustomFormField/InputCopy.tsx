import { cn } from '@renderer/helper'
import { get } from 'lodash'
import { FaRegCopy } from 'react-icons/fa'
import CopyComponent from './CopyComponent'
import InputField, { InputFieldProps } from './InputField'
import WapperLabelForm from './WapperLabelForm'

type InputCopyProps<T> = InputFieldProps<T>

const InputCopy = <T,>({
  label,
  isRequired,
  classWapper,
  isVertical,
  formik,
  name,
  clsLabelWrapper,
  ...spread
}: InputCopyProps<T>): JSX.Element => {
  return (
    <WapperLabelForm
      isRequired={isRequired}
      label={label}
      classWapper={classWapper}
      isVertical={isVertical}
      clsLabelWrapper={clsLabelWrapper}
    >
      <div
        className={cn(
          'form-input !py-0 flex items-center gap-1',
          spread?.disabled && 'bg-gray-100'
        )}
      >
        <InputField
          formik={formik}
          name={name}
          classWapper="[&>div>input]:border-0 [&>div>input]:shadow-none [&>div>input]:px-0 [&>div>input]:h-full flex-1"
          className="text-center shadow-none"
          {...spread}
        />

        <CopyComponent text={formik ? get(formik?.values, name) : spread?.value}>
          <FaRegCopy size={20} className="cursor-pointer text-gray-500" />
        </CopyComponent>
      </div>
    </WapperLabelForm>
  )
}

export default InputCopy
