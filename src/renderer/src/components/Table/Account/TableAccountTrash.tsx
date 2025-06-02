import type { Account } from '@preload/types'
import { TableStyleContextMenuWapper } from '@renderer/components'
import ReactTableGridCustom from '@renderer/components/ReactTableGridCustom/ReactTableGridCustom'
import { configTableManagerAccount } from '@renderer/config'
import type { ITableDefaultValue } from '@renderer/types'
import { memo } from 'react'

const TableAccountTrash = ({
  columns = configTableManagerAccount(),
  ...spreads
}: ITableDefaultValue<Account>): JSX.Element => {
  return (
    <div className="modal-trash">
      <TableStyleContextMenuWapper>
        <ReactTableGridCustom columns={columns ?? []} {...spreads} />
      </TableStyleContextMenuWapper>
    </div>
  )
}

export default memo(TableAccountTrash)
