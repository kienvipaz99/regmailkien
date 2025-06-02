import type { Account } from '@preload/types'
import ButtonFlowbite, { ButtonFlowbiteProps } from '@renderer/components/Default/ButtonFlowbite'
import { checkSelection } from '@renderer/config'
import { useUpdateAccountByField } from '@renderer/services'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IoReloadCircle } from 'react-icons/io5'

interface ButtonActionRecoveryAccountByCategoryProps extends ButtonFlowbiteProps {
  categoryIds: string[]
}

const ButtonActionRecoveryAccountByCategory: FC<ButtonActionRecoveryAccountByCategoryProps> = ({
  categoryIds,
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
          if (isPending || checkSelection(categoryIds, t, 'notifications.no_category_selected')) {
            updateAccountByField({
              key: 'category.id' as keyof Account,
              select: categoryIds,
              value: { is_show: true }
            })
          }
          updateAccountByField({
            key: 'category.id' as keyof Account,
            select: categoryIds,
            value: { is_show: true }
          })
        }}
        {...spread}
      >
        {spread?.children || t('account_recovery_by_category')}
      </ButtonFlowbite>
    </>
  )
}

export default ButtonActionRecoveryAccountByCategory
