import {
  ButtonFlowbite,
  ButtonFlowbiteProps,
  ModalHiddenRow,
  ModalHiddenRowProps
} from '@renderer/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiColumnsPlusRightLight } from 'react-icons/pi'

interface ButtonActionHiddenRowProps<T> extends ModalHiddenRowProps<T> {
  button?: ButtonFlowbiteProps
}

const ButtonActionHiddenRow = <T,>({
  button,
  ...spread
}: ButtonActionHiddenRowProps<T>): JSX.Element => {
  const { t } = useTranslation()
  const [isShowModalHiddenRow, setIsShowModalHiddenRow] = useState(false)

  const openModalHiddenRow = (): void => {
    setIsShowModalHiddenRow(true)
  }

  return (
    <>
      <ButtonFlowbite
        StartIcon={PiColumnsPlusRightLight}
        color="light"
        size="sm"
        className="rounded-xl bcg-warning"
        onClick={openModalHiddenRow}
        {...button}
      >
        {t('hidden_row')}
      </ButtonFlowbite>

      {isShowModalHiddenRow && (
        <ModalHiddenRow
          isShow={isShowModalHiddenRow}
          setIsShow={setIsShowModalHiddenRow}
          {...spread}
        />
      )}
    </>
  )
}

export default ButtonActionHiddenRow
