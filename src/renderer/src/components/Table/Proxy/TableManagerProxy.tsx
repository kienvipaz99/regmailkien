import ReactTableGridCustom from '@renderer/components/ReactTableGridCustom/ReactTableGridCustom'
import TableStyleContextMenuWapper from '@renderer/components/TableStyleContextMenuWapper'
import { configMenuActionProxy } from '@renderer/config'
import { configTableProxy } from '@renderer/config/configTable/proxy'
import { ITableDefaultValue } from '@renderer/types'
import type { Proxy } from '@vitechgroup/mkt-proxy-client'
import { memo } from 'react'

interface TableManagerProxyProps extends ITableDefaultValue<Proxy> {}

const TableManagerProxy = ({
  columns = configTableProxy(),
  ...spreads
}: TableManagerProxyProps): JSX.Element => {
  return (
    <div className="px-5">
      <TableStyleContextMenuWapper
        clsTablecustom={'table_proxy'}
        renderContext={{
          renderData: configMenuActionProxy(),
          valueClickItem: spreads.selectedRows && Array.from(spreads.selectedRows),
          expandValue: {
            t: spreads.t,
            setSelectedRecords: spreads.onSelectedRowsChange
            // setConfigSearch: spreads.setConfigPagination,
            // deleteProxy: spreads.deleteProxy,
            // useCopyProxyByField: spreads.useCopyProxyByField
          }
        }}
      >
        <ReactTableGridCustom columns={columns ?? []} {...spreads} />
      </TableStyleContextMenuWapper>
    </div>
  )
}

export default memo(TableManagerProxy)
