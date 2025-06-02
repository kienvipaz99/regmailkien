import { ButtonFlowbite, TextAreaField } from '@renderer/components'
import { Modal } from 'flowbite-react'
import { FormikProps } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

type TermsPopupProps<T> = {
  formik?: FormikProps<T>
  isShow: boolean
  name: string
  titleModal: string
  placeholder?: string
  setIsShow?: Dispatch<SetStateAction<boolean>>
  onClick?: () => void
}

const ModalText = <T,>({
  isShow,
  name,
  setIsShow,
  onClick,
  titleModal,
  placeholder,
  formik
}: TermsPopupProps<T>): JSX.Element => {
  const handleClose = (): void => {
    onClick && onClick()
    setIsShow && setIsShow(false)
  }

  const handleSubmit = (): void => {
    setIsShow && setIsShow(false)
  }

  const { t } = useTranslation()

  return (
    <Modal show={isShow} onClose={handleClose} size={'4xl'}>
      <Modal.Header>{t(titleModal)}</Modal.Header>
      <Modal.Body className="">
        <TextAreaField
          name={name}
          className="min-h-[250px] max-h-[350px]"
          formik={formik}
          placeholder={placeholder}
        />
      </Modal.Body>
      <Modal.Footer className="flex justify-center items-center gap-3 px-5 py-3">
        <ButtonFlowbite type="submit" color="blue" onClick={handleSubmit}>
          {t('save')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalText
