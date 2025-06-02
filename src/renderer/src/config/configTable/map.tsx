import { AccountGmail } from '@preload/types'
import { configContextMenuType } from '@renderer/components/ContextMenu/RenderContextMenu'
import ToolTips from '@renderer/components/Default/Tooltips'
import { TColumnsTable } from '@renderer/types'
import { t } from 'i18next'
import { isEmpty } from 'lodash'
import { FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'

export const configTableScanMap = (): TColumnsTable<AccountGmail> => [
  {
    key: 'email',
    name: 'tables.email',
    sortable: true,
    resizable: true,
    width: 250
  },
  {
    key: 'password',
    name: 'tables.password',
    width: 300,
    sortable: true,
    resizable: true,
    renderCell: ({ row: { password } }) => (
      <ToolTips content={password}>
        <span>{password}</span>
      </ToolTips>
    )
  },

  {
    key: 'created_at',
    name: 'tables.created_at',
    sortable: true,
    resizable: true
  }
  // {
  //   key: 'open_time',
  //   name: 'tables.open_time',
  //   sortable: true
  // },
  // {
  //   key: 'avatar',
  //   name: 'tables.avatar',
  //   sortable: true
  // },
  // {
  //   key: 'gps',
  //   name: 'tables.gps',
  //   sortable: true,
  //   renderCell: ({ row: { gps } }): JSX.Element => <span>{gps === 'null' ? '-' : gps}</span>
  // }
]

export const configMenuScanKeyword = (): configContextMenuType[] => {
  return [
    {
      Icon: FaTrash,
      action: 'remove_line_select',
      onClick: async (accounts: string[]): Promise<void> => {
        if (isEmpty(accounts)) {
          toast.warn(t('notifications.no_page_select'))
          return
        }
      }
    },
    {
      Icon: FaTrash,
      action: 'remove_all_data',
      onClick: async (accounts: string[]): Promise<void> => {
        if (isEmpty(accounts)) {
          toast.warn(t('notifications.no_page_select'))
          return
        }
      }
    }
  ]
}
