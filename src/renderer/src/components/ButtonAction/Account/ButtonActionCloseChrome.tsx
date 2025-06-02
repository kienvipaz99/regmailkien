import { IMainResponse, IPayloadStartAction } from '@preload/types'
import ButtonFlowbite, { ButtonFlowbiteProps } from '@renderer/components/Default/ButtonFlowbite'
import { useButtonStateProvider } from '@renderer/context'
import { UseMutateFunction } from '@tanstack/react-query'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiChrome } from 'react-icons/fi'

interface ButtonActionCloseChromeProps extends ButtonFlowbiteProps {
  startAction?: UseMutateFunction<IMainResponse<boolean>, Error, IPayloadStartAction, unknown>
}

const ButtonActionCloseChrome: FC<ButtonActionCloseChromeProps> = ({ startAction, ...spread }) => {
  const { t } = useTranslation()
  const { isPendingCheck, isPendingClose } = useButtonStateProvider()

  return (
    <ButtonFlowbite
      onClick={() => startAction && startAction({ actionName: 'close_chrome', data: [] })}
      StartIcon={FiChrome}
      color="light"
      className="rounded-xl bcg-failure btn-close-chrome"
      size="sm"
      disabled={isPendingCheck || isPendingClose}
      isProcessing={isPendingClose}
      {...spread}
    >
      {spread?.children || t('close_chrome')}
    </ButtonFlowbite>
  )
}

export default memo(ButtonActionCloseChrome)
