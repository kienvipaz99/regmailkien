import { SelectField } from '@renderer/components/CustomFormField'
import { IDispatchState } from '@renderer/types'
import { Button, Modal } from 'flowbite-react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  isShow?: boolean
  setIsShow?: IDispatchState<boolean>
  handleConfirm?: () => void
}

const ModalSelectTypeExport: FC<Props> = ({ isShow, setIsShow, handleConfirm }) => {
  const { t } = useTranslation()
  const handleClickConfirm = (): void => {
    handleConfirm && handleConfirm()
    handleClose()
  }
  const handleClose = (): void => setIsShow && setIsShow(false)
  return (
    <Modal show={isShow} onClose={handleClose}>
      <Modal.Header>{t('choose_file_type')}</Modal.Header>
      <Modal.Body className="overflow-visible">
        <SelectField
          name=""
          options={[
            { value: 'excel', label: 'Excel' },
            { value: 'txt', label: 'Text' }
          ]}
        />
      </Modal.Body>
      <Modal.Footer className="z-10 justify-center">
        <Button color="blue" onClick={handleClickConfirm}>
          {t('confirm')}
        </Button>
        <Button color="failure" onClick={handleClose}>
          {t('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalSelectTypeExport
