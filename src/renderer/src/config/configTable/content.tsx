import type { AccountGmail, Maps, Post } from '@preload/types'
import type { ITableData, TColumnsTable } from '@renderer/types'

export const configTableContentManagement = (payload?: ITableData): TColumnsTable<Post> => [
  {
    key: 'title',
    name: 'title'
  },

  {
    key: 'post_type',
    name: 'type',
    renderCell: ({ row: { post_type } }): JSX.Element => (
      <span>{payload?.t?.(post_type) ?? post_type ?? '-'}</span>
    )
  },

  {
    key: 'type_post',
    name: 'post_type',
    renderCell: ({ row: { type_post } }): JSX.Element => (
      <span>{payload?.t?.(type_post) ?? type_post ?? '-'}</span>
    )
  },

  {
    key: 'content',
    name: 'content',
    width: 500
  },

  {
    key: 'time',
    name: 'time'
  },

  {
    key: 'category',
    name: 'account_key.category',
    renderCell: ({ row: { category } }): JSX.Element => <span>{category?.name ?? '-'}</span>
  }
]

export const configTableScanPost: TColumnsTable<Post> = [
  {
    key: 'id',
    name: 'id_scan'
  },

  {
    key: 'content',
    name: 'content'
  },

  {
    key: 'count_media',
    name: 'count_media'
  }
]

export const configTableScanGMap: TColumnsTable<Maps> = [
  {
    key: 'id',
    name: 'id_scan'
  },

  {
    key: 'content',
    name: 'content'
  },

  {
    key: 'count_media',
    name: 'count_media'
  }
]

export const configTableAccountGmail: TColumnsTable<AccountGmail> = [
  {
    key: 'id',
    name: 'id_scan'
  },

  {
    key: 'email',
    name: 'email'
  },

  {
    key: 'password',
    name: 'password'
  },

  {
    key: 'created_at',
    name: 'created_at'
  }
]
