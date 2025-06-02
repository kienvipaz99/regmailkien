import { ButtonFlowbite } from '@renderer/components'
import { UseMutateFunction, UseMutationResult } from '@tanstack/react-query'
import { Modal } from 'flowbite-react'
import { t } from 'i18next'
import { Dispatch, FC, ReactNode, SetStateAction, useEffect } from 'react'

export interface ModalConfirmProps {
  title?: string | ReactNode
  children?: string | ReactNode
  isShow?: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
  onCancel?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (mutate?: UseMutateFunction<any, Error, any, unknown>) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CallAPi?: () => UseMutationResult<any, Error, any, unknown>
  onSuccess?: () => void
  isProcessing?: boolean
}

const ModalConfirm: FC<ModalConfirmProps> = ({
  title = t('general_management.notification'),
  children = t('sure_want_delete'),
  isShow,
  setIsShow,
  onCancel,
  onChange,
  CallAPi,
  onSuccess,
  isProcessing
}) => {
  const { mutate, isPending, status } = (CallAPi && CallAPi()) ?? {}

  const handleClose = (): void => {
    if (isPending || isProcessing) return
    setIsShow && setIsShow(false)
    onCancel && onCancel()
  }

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      if (status === 'success') {
        onSuccess && onSuccess()
      }
      handleClose()
    }
  }, [status])

  return (
    <Modal show={isShow} onClose={handleClose}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer className="flex justify-end">
        <ButtonFlowbite color="failure" onClick={handleClose} disabled={isPending || isProcessing}>
          {t('cancel')}
        </ButtonFlowbite>
        <ButtonFlowbite
          color="blue"
          isProcessing={isPending || isProcessing}
          onClick={() => {
            onChange && onChange(mutate)
          }}
        >
          {t('submit')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalConfirm
