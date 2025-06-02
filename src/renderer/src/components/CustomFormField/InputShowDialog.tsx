import type { IDialogType } from '@preload/types'
import { cn } from '@renderer/helper'
import { IoFolderOpenSharp } from 'react-icons/io5'
import InputField, { InputFieldProps } from './InputField'
import WapperShowDialog, { WapperShowDialogProps } from './WapperShowDialog'

interface InputShowDialogProps<T>
  extends WapperShowDialogProps<T>,
    Omit<InputFieldProps<T>, 'name' | 'formik'> {
  classWapper?: string
  type?: IDialogType
}

const InputShowDialog = <T,>({
  name,
  formik,
  type: type,
  height = '38px',
  classWapperDialog,
  onClickValue,
  ...spread
}: InputShowDialogProps<T>): JSX.Element => {
  return (
    <WapperShowDialog
      classWapperDialog={classWapperDialog}
      formik={formik}
      name={name}
      onClickValue={onClickValue}
      type={type}
    >
      <div className={cn('flex items-center flex-1 w-[350px] relative', classWapperDialog)}>
        <InputField
          name={name}
          placeholder="C:\Program Files"
          className="py-2 rounded-tr-none rounded-br-none"
          classWapper="flex-1"
          disabled
          formik={formik}
          height={height}
          accept={type === 'file' ? '.exe' : ''}
          {...spread}
        />
        <IoFolderOpenSharp
          className="cursor-pointer text-[#2E8CED] cts-icon !relative"
          size={30}
          style={{ height }}
        />
      </div>
    </WapperShowDialog>
  )
}

export default InputShowDialog
