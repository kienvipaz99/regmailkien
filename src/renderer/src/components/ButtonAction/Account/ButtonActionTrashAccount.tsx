import { ButtonFlowbite, ButtonFlowbiteProps, ModalTrash } from '@renderer/components'
import { Trash2 } from 'lucide-react'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ButtonActionTrashAccountProps extends ButtonFlowbiteProps {}

const ButtonActionTrashAccount: FC<ButtonActionTrashAccountProps> = ({ ...spread }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ButtonFlowbite
        outline
        color="light"
        StartIcon={Trash2}
        size="sm"
        className="rounded-xl bcg-failure"
        onClick={() => setIsOpen(true)}
        {...spread}
      >
        {spread?.children || t('trash_can')}
      </ButtonFlowbite>
      {isOpen && <ModalTrash isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  )
}

export default ButtonActionTrashAccount
