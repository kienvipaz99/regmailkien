import { cn } from '@renderer/helper'
import { useState } from 'react'
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi'
import ErrorHelperText from './ErrorHelperText'
import InputField, { InputFieldProps } from './InputField'
import WapperLabelForm from './WapperLabelForm'

interface InputPasswordProps<T> extends InputFieldProps<T> {
  isShowDefault?: boolean
  password: string
}

const InputPasswordTable = <T,>({
  name,
  label,
  isRequired,
  classWapper,
  isVertical,
  msgError,
  isShowDefault = false,
  password,
  clsInput,
  ...rest
}: InputPasswordProps<T>): JSX.Element => {
  const [isShow, setIsShow] = useState(isShowDefault)

  const displayPassword = isShow
    ? (password ?? '')
    : password && password.length > 4
      ? `${password.slice(0, 4)}${'*'.repeat(password.length - 4)}`
      : (password ?? '')

  return (
    <WapperLabelForm
      isRequired={isRequired}
      label={label}
      classWapper={classWapper}
      isVertical={isVertical}
    >
      <div className="relative">
        <InputField
          name={name}
          hiddenError
          clsInput="border-0"
          {...rest}
          value={displayPassword}
          type="text"
          className={cn('pointer-events-none w-[130px] overflow-hidden text-ellipsis', clsInput)}
          readOnly
        />
        <div
          className="absolute -translate-y-1/2 top-1/2 -right-0 [&>*]:cursor-pointer select-none"
          onClick={(): void => {
            setIsShow((prev) => !prev)
          }}
        >
          {!isShow ? <PiEyeBold /> : <PiEyeClosedBold />}
        </div>
      </div>
      {msgError && <ErrorHelperText isShow={!!msgError} msgError={msgError} />}
    </WapperLabelForm>
  )
}

export default InputPasswordTable
