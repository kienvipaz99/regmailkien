import { Account } from '@preload/types'
import { ModalBackupProfile } from '@renderer/components/Modal'
import ModalChangeCategory from '@renderer/components/Modal/Account/ModalChangeCategory'
import ModalCopyAccount from '@renderer/components/Modal/Account/ModalCopyAccount'
import ModalEditAccount from '@renderer/components/Modal/Account/ModalEditAccount'
import ReactTableGridCustom from '@renderer/components/ReactTableGridCustom/ReactTableGridCustom'
import TableStyleContextMenuWapper from '@renderer/components/TableStyleContextMenuWapper'
import { configMenuActionAccount } from '@renderer/config/configContextMenu'
import { configTableManagerAccount } from '@renderer/config/configTable/account'
import { ITableDefaultValue } from '@renderer/types'
import { memo, useState } from 'react'

interface TableManagerAccountProps extends ITableDefaultValue<Account> {}

const TableManagerAccount = ({
  columns = configTableManagerAccount(),
  ...spreads
}: TableManagerAccountProps): JSX.Element => {
  const listUid = Array.from(spreads.selectedRows ?? [])
  const [isShowEdit, setIsShowEdit] = useState<boolean>(false)
  const [isCopy, setIsCopy] = useState<boolean>(false)
  const [isChangeCate, setIsChangeCate] = useState<boolean>(false)
  const [isBackup, setIsBackup] = useState<boolean>(false)

  return (
    <div className="px-5">
      {isBackup && (
        <ModalBackupProfile isShow={isBackup} setIsShow={setIsBackup} listUid={listUid} />
      )}
      {isShowEdit && (
        <ModalEditAccount isShow={isShowEdit} setIsShow={setIsShowEdit} uidAccount={listUid} />
      )}
      {isCopy && <ModalCopyAccount isShow={isCopy} setIsShow={setIsCopy} accounts={listUid} />}
      {isChangeCate && (
        <ModalChangeCategory isShow={isChangeCate} setIsShow={setIsChangeCate} listUid={listUid} />
      )}
      <TableStyleContextMenuWapper
        clsTablecustom={'table_manager_account_custom'}
        renderContext={{
          renderData: configMenuActionAccount(
            spreads.settingSystem?.show_avatar,
            spreads.payloadPending
          ),
          valueClickItem: spreads.selectedRows && Array.from(spreads.selectedRows),
          expandValue: {
            setIsShowEdit,
            setIsCopy,
            setIsChangeCate,
            setIsBackup,
            t: spreads.t,
            setSelectedRecords: spreads.onSelectedRowsChange,
            removeFieldBy: spreads.removeFieldBy,
            updateByClipboard: spreads.updateByClipboard,
            copyByField: spreads.copyByField,
            copy2faCode: spreads.copy2faCode,
            updateAccountByField: spreads.updateAccountByField,
            actionBy: spreads.actionBy,
            startAction: spreads.startAction,
            updateSettings: spreads.updateSettings,
            setAction: spreads.setAction
          }
        }}
      >
        <ReactTableGridCustom columns={columns ?? []} {...spreads} />
      </TableStyleContextMenuWapper>
    </div>
  )
}

export default memo(TableManagerAccount)
