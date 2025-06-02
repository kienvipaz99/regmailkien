import ToolTips from '@renderer/components/Default/Tooltips'
import { ITableData, TColumnsTable } from '@renderer/types'
import { convertTimestampToDate } from '@renderer/utils'
import { Session } from '@vitechgroup/mkt-proxy-client'

export const configTableHistoryProxy = (payload?: ITableData): TColumnsTable<Session> => {
  payload

  return [
    {
      key: 'time',
      name: 'time',
      sortable: true,
      renderCell: ({ row: { createdAt, endTime } }): JSX.Element => {
        return (
          <span>
            {convertTimestampToDate(createdAt)} - {convertTimestampToDate(endTime)}
          </span>
        )
      }
    },
    {
      key: 'proxy',
      name: 'Proxy',
      sortable: true,
      renderCell: ({ row: { proxy } }): JSX.Element => {
        return (
          <p>
            <span>{proxy.host}</span>
            <span>:</span>
            <span>{proxy.port}</span>
          </p>
        )
      }
    },
    {
      key: 'event',
      name: 'event',
      sortable: true,
      renderCell: ({ row: { errorMessage } }): JSX.Element => {
        return <p>{errorMessage}</p>
      }
    },
    {
      key: 'detail',
      name: 'detail',
      sortable: true,
      renderCell: ({ row: { proxy } }): JSX.Element => {
        const logs = proxy.logs
        const log = logs.map((item) => item.message).join('=>')
        return <ToolTips content={log}>{log}</ToolTips>
      }
    },
    {
      key: 'status',
      width: 150,
      name: 'status',
      sortable: true,
      renderCell: ({ row: { status } }): JSX.Element => (
        <span style={{ color: status !== 'Crashed' ? 'green' : 'red' }}>
          {payload?.t ? payload?.t(status !== 'Crashed' ? 'success' : 'error') : '-'}
        </span>
      )
    }
  ]
}
