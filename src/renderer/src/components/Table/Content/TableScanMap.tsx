import { AccountGmail } from '@preload/types'
import ReactTableGridCustom from '@renderer/components/ReactTableGridCustom/ReactTableGridCustom'
import TableStyleContextMenuWapper from '@renderer/components/TableStyleContextMenuWapper'
import { configTableAccountGmail } from '@renderer/config/configTable/content'
import type { ITableDefaultValue } from '@renderer/types'

interface TableScanPostProps extends ITableDefaultValue<AccountGmail> {}

const TableScanPost = ({
  columns = configTableAccountGmail,
  selectedRows,
  onSelectedRowsChange,
  ...spreads
}: TableScanPostProps): JSX.Element => {
  return (
    <div className="px-5 ">
      <TableStyleContextMenuWapper
      // renderContext={{
      //   renderData: configMenuScanKeyword()
      // }}
      >
        <ReactTableGridCustom
          selectedRows={selectedRows}
          onSelectedRowsChange={onSelectedRowsChange}
          columns={columns ?? []}
          rowKeyGetter="uuid"
          {...spreads}
        />
      </TableStyleContextMenuWapper>
    </div>
  )
}

export default TableScanPost
