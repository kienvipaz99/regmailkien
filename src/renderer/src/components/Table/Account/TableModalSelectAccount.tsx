import ReactTableGridCustom from '@renderer/components/ReactTableGridCustom/ReactTableGridCustom'
import TableStyleContextMenuWapper from '@renderer/components/TableStyleContextMenuWapper'
import { cn } from '@renderer/helper'
import type { IReactTableGridCustom } from '@renderer/types'
import { Key } from 'react'
import { ColumnOrColumnGroup } from 'react-data-grid'

const TableModalSelectAccount = <T, SR, K extends Key>({
  data,
  page,
  pageSize,
  total,
  onSelectedRowsChange,
  setConfigPagination,
  columns,
  selectedRows,
  clsHeight,
  fetching
}: IReactTableGridCustom<T, SR, K> & { clsHeight?: string }): JSX.Element => {
  const typedColumns = columns as readonly ColumnOrColumnGroup<NoInfer<T>, unknown>[]
  return (
    <TableStyleContextMenuWapper
      clsTablecustom={cn('manager_account h-full', clsHeight)}
      renderContext={{
        valueClickItem: selectedRows
      }}
    >
      <ReactTableGridCustom
        data={data}
        selectedRows={selectedRows}
        onSelectedRowsChange={onSelectedRowsChange}
        page={page}
        pageSize={pageSize}
        total={total}
        setConfigPagination={setConfigPagination}
        columns={typedColumns}
        fetching={fetching}
        classNameWapperTable=" custom-height"
      />
    </TableStyleContextMenuWapper>
  )
}

export default TableModalSelectAccount
