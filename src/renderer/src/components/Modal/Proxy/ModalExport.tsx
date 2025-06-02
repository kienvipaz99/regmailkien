import { ButtonFlowbite, InputGroupCheckboxNumber } from '@renderer/components'
import { Modal } from 'flowbite-react'
import { FormikProps } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

type TermsPopupProps<T> = {
  formik?: FormikProps<T>
  isShow: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
  onClick?: () => void
}

const ModalExport = <T,>({
  isShow,
  setIsShow,
  onClick,
  formik
}: TermsPopupProps<T>): JSX.Element => {
  const handleClose = (): void => {
    onClick && onClick()
    setIsShow && setIsShow(false)
  }
  const { t } = useTranslation()
  return (
    <Modal show={isShow} onClose={handleClose} size={'7xl'}>
      <Modal.Header>{t('assign_proxy')}</Modal.Header>
      <Modal.Body className="">
        <div>
          <InputGroupCheckboxNumber
            formik={formik}
            config={{
              nameRadio: 'config_group_uid.order',
              radioProps: {
                value: 'random',
                checked: formik?.values === 'get_content',
                onChange: () => {
                  formik?.setFieldValue('config_content.type', 'get_content')
                }
              }
            }}
            configLabel={{
              label: t('comment_random_id_group')
            }}
          />

          <InputGroupCheckboxNumber
            formik={formik}
            config={{
              nameRadio: 'config_group_uid.order',
              radioProps: {
                value: 'in_turn',
                checked: formik?.values === 'get_content',
                onChange: () => {
                  formik?.setFieldValue('config_content.type', 'get_content')
                }
              }
            }}
            configLabel={{
              label: t('comment_order')
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-center items-center gap-3 px-5 py-3">
        <ButtonFlowbite onClick={handleClose} color="failure">
          {t('close')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalExport
