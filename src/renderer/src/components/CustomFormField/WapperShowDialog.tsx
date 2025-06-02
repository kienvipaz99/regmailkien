import type { IDialogType } from '@preload/types'
import { cn } from '@renderer/helper'
// import { useShowDialog } from '@renderer/service'
import { useShowDialog } from '@renderer/services'
import { PropsWithChildren } from 'react'
import { InputFieldProps } from './InputField'

export interface WapperShowDialogProps<T>
  extends Pick<InputFieldProps<T>, 'formik' | 'name'>,
    PropsWithChildren {
  type?: IDialogType
  classWapperDialog?: string
  onClickValue?: (path: string | string[]) => void
}

const WapperShowDialog = <T,>({
  classWapperDialog,
  formik,
  onClickValue,
  type: type,
  children,
  name
}: WapperShowDialogProps<T>): JSX.Element => {
  const { mutateAsync: showDialog } = useShowDialog()

  const handleShowPath = async (): Promise<void> => {
    if (!type) {
      console.error('Type is undefined')
      return
    }
    const result = await showDialog({ type })
    formik && result.payload?.data && name && formik.setFieldValue(name, result.payload.data)
    onClickValue && result.payload?.data && onClickValue(result.payload.data ?? '')
  }

  return (
    <div className={cn(classWapperDialog)} onClick={handleShowPath}>
      {children}
    </div>
  )
}

export default WapperShowDialog
