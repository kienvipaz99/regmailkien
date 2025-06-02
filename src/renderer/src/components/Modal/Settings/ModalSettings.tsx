import { ButtonFlowbite } from '@renderer/components'
import type { IModalDefault } from '@renderer/types'
import { Modal } from 'flowbite-react'
import { FC, useCallback, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TabsSetting from './TabsSetting'

interface ModalSettingProps extends IModalDefault<unknown> {}

const ModalSetting: FC<ModalSettingProps> = ({ isShow, setIsShow }) => {
  const idForm = useId()
  const [isDisable, setIsDisable] = useState(false)
  const [currentButton, setCurrentButton] = useState('')
  const { t } = useTranslation()

  const handleClosed = useCallback((): void => {
    setIsShow && setIsShow(false)
  }, [])

  return (
    <Modal show={isShow} onClose={handleClosed} size="4xl">
      <Modal.Body className="p-0 mt-2 h-[70vh] !flex-auto overflow-hidden">
        <TabsSetting
          handleClosed={handleClosed}
          formId={idForm}
          isDisable={isDisable}
          setIsDisable={setIsDisable}
          currentButton={currentButton}
        />
      </Modal.Body>
      <Modal.Footer className="flex justify-end  py-3">
        <ButtonFlowbite
          form={idForm}
          type="submit"
          color="blue"
          disabled={isDisable}
          onClick={() => setCurrentButton('save_no_close')}
        >
          {t('save')}
        </ButtonFlowbite>
        <ButtonFlowbite type="button" onClick={handleClosed} color="failure" disabled={isDisable}>
          {t('cancel')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalSetting
