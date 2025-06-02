import ReactTableGridCustom from '@renderer/components/ReactTableGridCustom/ReactTableGridCustom'
import { configTableHistoryProxy } from '@renderer/config/configTable/historyProxy'
import { ITableDefaultValue } from '@renderer/types/renderer'
import { Session } from '@vitechgroup/mkt-proxy-client'

interface TableHistoryPostProps extends ITableDefaultValue<Session> {}

const TableHistoryProxy = ({
  columns = configTableHistoryProxy(),
  ...spreads
}: TableHistoryPostProps): JSX.Element => {
  return <ReactTableGridCustom columns={columns ?? []} rowKeyGetter="id" {...spreads} />
}

export default TableHistoryProxy
