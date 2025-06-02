export type * from '@vitechgroup/mkt-maps'
export * from '../../main/core/nodejs/enum'
export type * from '../../main/database/entities'
export type * from '../../main/types'
export type * from '../../renderer/src/types'
export * from '../../renderer/src/utils'
export type * from './ipc'

export interface IPayloadCreateGmail {
  creation_method: 'browser' | 'phone'
  default_password: string
  use_random_password: boolean
  first_name_path: string
  last_name_path: string
  interval: {
    from: number
    to: number
  }
  number_of_accounts: number
}
