import ButtonFlowbite, { ButtonFlowbiteProps } from '@renderer/components/Default/ButtonFlowbite'
import { useUpdateAccountByField } from '@renderer/services'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IoReloadCircle } from 'react-icons/io5'

interface ButtonActionRecoveryAccountProps extends ButtonFlowbiteProps {
  accounts: string[]
}

const ButtonActionRecoveryAccount: FC<ButtonActionRecoveryAccountProps> = ({
  accounts,
  ...spread
}) => {
  const { t } = useTranslation()
  const { mutate: updateAccountByField, isPending } = useUpdateAccountByField()

  return (
    <>
      <ButtonFlowbite
        StartIcon={IoReloadCircle}
        color="blue"
        isProcessing={isPending}
        onClick={() => {
          if (isPending || !accounts) return
          updateAccountByField({
            key: 'uid',
            select: Array.from(accounts),
            value: { is_show: true }
          })
        }}
        {...spread}
      >
        {spread?.children || t('account_recovery')}
      </ButtonFlowbite>
    </>
  )
}

export default ButtonActionRecoveryAccount
