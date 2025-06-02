import { useState } from 'react'
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi'
import ErrorHelperText from './ErrorHelperText'
import InputField, { InputFieldProps } from './InputField'
import WapperLabelForm from './WapperLabelForm'
import { get } from 'lodash'

interface InputPasswordProps<T> extends InputFieldProps<T> {
  isShowDefault?: boolean
}

const InputPasswordField = <T,>({
  name,
  label,
  isRequired,
  classWapper,
  isVertical,
  msgError,
  isShowDefault = false,
  formik,
  clsLabelWrapper,
  ...rest
}: InputPasswordProps<T>): JSX.Element => {
  const [isShow, setIsShow] = useState(isShowDefault)

  return (
    <WapperLabelForm
      isRequired={isRequired}
      label={label}
      classWapper={classWapper}
      isVertical={isVertical}
      clsLabelWrapper={clsLabelWrapper}
    >
      <div className="relative">
        <InputField
          name={name}
          formik={formik}
          hiddenError
          {...rest}
          type={`${isShow ? 'text' : 'password'}`}
        />
        <div
          className="absolute -translate-y-1/2 top-1/2 right-2 [&>*]:cursor-pointer select-none"
          onClick={(): void => {
            setIsShow((prev) => !prev)
          }}
        >
          {!isShow && <PiEyeBold />}
          {isShow && <PiEyeClosedBold />}
        </div>
      </div>
      <ErrorHelperText
        isShow={(formik && get(formik?.touched, name) && get(formik?.errors, name)) || msgError}
        msgError={msgError ? msgError : get(formik?.errors, name)}
      />
    </WapperLabelForm>
  )
}

export default InputPasswordField
