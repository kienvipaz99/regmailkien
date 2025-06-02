import type { Account } from '@preload/types'
import { Tooltips, ToolTipsCustom } from '@renderer/components/Default'
import ButtonFlowbite, { ButtonFlowbiteProps } from '@renderer/components/Default/ButtonFlowbite'
import { ModalConfirm } from '@renderer/components/Modal/Default'
import { useRemoveAccountByField } from '@renderer/services'
import type { IDispatchState } from '@renderer/types'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdDeleteForever } from 'react-icons/md'
import { toast } from 'react-toastify'

interface ButtonActionDeleteAccountProps extends ButtonFlowbiteProps {
  accountsIds?: string[]
  categoryIds?: string[]
  setAccountIds?: IDispatchState<ReadonlySet<string>>
  setCategoryIds?: IDispatchState<string[]>
  tooltips?: Omit<ToolTipsCustom, 'children'>
}

const ButtonActionDeleteAccount: FC<ButtonActionDeleteAccountProps> = ({
  accountsIds,
  categoryIds,
  tooltips,
  setAccountIds,
  setCategoryIds,
  ...spread
}) => {
  const { t } = useTranslation()
  const [isShow, setIsShow] = useState(false)
  const { mutate: removeByField, isPending } = useRemoveAccountByField()

  const handleClose = (): void => {
    setIsShow(false)
  }

  const handleDeleteAccount = (): void => {
    if (categoryIds && categoryIds.length > 0) {
      removeByField(
        [
          { key: `category.id` as keyof Account, select: categoryIds },
          { key: 'is_show', select: false }
        ],
        {
          onSettled: (result) => {
            if (result?.status === 'success') {
              setCategoryIds && setCategoryIds([])
            }
          }
        }
      )
    } else if (accountsIds && accountsIds?.length > 0) {
      removeByField(
        [
          { key: 'uid', select: accountsIds },
          { key: 'is_show', select: false }
        ],
        {
          onSettled: (result) => {
            if (result?.status === 'success') {
              setAccountIds && setAccountIds(new Set())
            }
          }
        }
      )
    } else {
      toast.warn(t('notifications.no_records'))
    }
    handleClose()
  }

  return (
    <Tooltips content={t('remove_all_account')} {...tooltips}>
      <ButtonFlowbite
        StartIcon={MdDeleteForever}
        color="failure"
        isProcessing={isPending}
        onClick={() => {
          if (isPending) return
          setIsShow(true)
        }}
        {...spread}
      >
        {spread?.children || t('permanently_delete')}
      </ButtonFlowbite>

      <ModalConfirm
        isShow={isShow}
        setIsShow={setIsShow}
        isProcessing={isPending}
        onChange={handleDeleteAccount}
      />
    </Tooltips>
  )
}

export default ButtonActionDeleteAccount
