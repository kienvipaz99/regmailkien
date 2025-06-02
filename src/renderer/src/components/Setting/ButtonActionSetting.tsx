import { ButtonHeaderWapper, ModalSettings, SettingsIcon } from '@renderer/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const ButtonActionSetting = (): JSX.Element => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ButtonHeaderWapper
        content={t(`general_management.setting`)}
        onClick={(): void => {
          setIsOpen(true)
        }}
      >
        <SettingsIcon
          w={23}
          h={23}
          className="hover:text-primary hover:animate-[spin_3s_linear_infinite]"
        />
      </ButtonHeaderWapper>
      {isOpen && <ModalSettings isShow={isOpen} setIsShow={setIsOpen} />}
    </>
  )
}

export default ButtonActionSetting
