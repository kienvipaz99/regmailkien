import type { Post } from '@preload/types'
import ReactTableGridCustom from '@renderer/components/ReactTableGridCustom/ReactTableGridCustom'
import { configTableScanPost } from '@renderer/config/configTable/content'
import type { ITableDefaultValue } from '@renderer/types'

interface TableScanPostProps extends ITableDefaultValue<Post> {}

const TableScanPost = ({
  columns = configTableScanPost,
  selectedRows,
  onSelectedRowsChange,
  ...spreads
}: TableScanPostProps): JSX.Element => {
  return (
    <>
      <ReactTableGridCustom
        selectedRows={selectedRows}
        onSelectedRowsChange={onSelectedRowsChange}
        columns={columns ?? []}
        rowKeyGetter="uuid"
        {...spreads}
        classNameWapperTable="table-scan-post"
      />
    </>
  )
}

export default TableScanPost
