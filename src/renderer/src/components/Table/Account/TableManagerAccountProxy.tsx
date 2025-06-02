import { Account } from '@preload/types'
import ReactTableGridCustom from '@renderer/components/ReactTableGridCustom/ReactTableGridCustom'
import { configTableManagerAccount } from '@renderer/config/configTable/account'
import { ITableDefaultValue } from '@renderer/types'
import { memo } from 'react'

interface TableManagerAccountProps extends ITableDefaultValue<Account> {}

const TableManagerAccountProxy = ({
  columns = configTableManagerAccount(),
  ...spreads
}: TableManagerAccountProps): JSX.Element => {
  return (
    <div className="px-5 account-proxy">
      <ReactTableGridCustom columns={columns ?? []} {...spreads} />
    </div>
  )
}

export default memo(TableManagerAccountProxy)
