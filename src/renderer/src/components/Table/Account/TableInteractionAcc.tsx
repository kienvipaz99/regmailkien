import type { Account } from '@preload/types'
import ReactTableGridCustom from '@renderer/components/ReactTableGridCustom/ReactTableGridCustom'
import { configTableInteractionAccount } from '@renderer/config/configTable/account'
import type { ITableDefaultValue } from '@renderer/types'
import { memo } from 'react'

interface TableInteractionAccProps extends ITableDefaultValue<Account> {}

const TableInteractionAcc = ({
  columns = configTableInteractionAccount({ dataHistory: [] }),
  ...spreads
}: TableInteractionAccProps): JSX.Element => {
  return <ReactTableGridCustom columns={columns ?? []} {...spreads} />
}

export default memo(TableInteractionAcc)
