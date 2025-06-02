import { FC } from 'react'

interface ErrorHelperTextProps {
  isShow?: boolean
  msgError?: string
}

const ErrorHelperText: FC<ErrorHelperTextProps> = ({ isShow, msgError }) => {
  return <>{isShow && <span className="text-sm w-max text-red-600 block mt-2">{msgError}</span>}</>
}

export default ErrorHelperText
