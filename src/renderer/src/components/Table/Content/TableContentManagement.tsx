import type { Post } from '@preload/types'
import ModalChangeCategory from '@renderer/components/Modal/Account/ModalChangeCategory'
import ModalContentManagement from '@renderer/components/Modal/Content/ModalContentManagement'
import ReactTableGridCustom from '@renderer/components/ReactTableGridCustom/ReactTableGridCustom'
import TableStyleContextMenuWapper from '@renderer/components/TableStyleContextMenuWapper'
import { configTableContentManagement } from '@renderer/config'
import { configContextMenuContentManagement } from '@renderer/config/configContextMenu'
import type { ITableDefaultValue } from '@renderer/types'
import { useState } from 'react'

interface TableContentManagementProps extends ITableDefaultValue<Post> {}

const TableContentManagement = ({
  columns = configTableContentManagement(),
  ...spreads
}: TableContentManagementProps): JSX.Element => {
  const [isChangeCate, setIsChangeCate] = useState<boolean>(false)
  const [isOpenEditContent, setIsOpenEditContent] = useState<boolean>(false)

  return (
    <>
      {isChangeCate && (
        <ModalChangeCategory
          isShow={isChangeCate}
          type="post"
          setSelectedRecords={spreads.onSelectedRowsChange}
          setIsShow={setIsChangeCate}
          listUid={Array.from(spreads.selectedRows ?? [])}
        />
      )}
      {isOpenEditContent && (
        <ModalContentManagement
          isShow={isOpenEditContent}
          setIsShow={setIsOpenEditContent}
          listUid={Array.from(spreads.selectedRows ?? [])}
        />
      )}
      <TableStyleContextMenuWapper
        renderContext={{
          renderData: configContextMenuContentManagement(),
          valueClickItem: spreads.selectedRows && Array.from(spreads.selectedRows),
          expandValue: {
            t: spreads.t,
            setIsChangeCate,
            setIsOpenEditContent,
            removePostByField: spreads.removePostByField
          }
        }}
      >
        <ReactTableGridCustom columns={columns ?? []} rowKeyGetter="uuid" {...spreads} />
      </TableStyleContextMenuWapper>
    </>
  )
}

export default TableContentManagement
