import type { ILogin, ILoginToolResponse, IProfile, MktUser } from '@vitechgroup/mkt-key-client'

export type * from '../core/types'
export type * from '../nodejs/helper/enum'
export type * from './ipc'
export type * from './job'
export type * from './main'
export type * from './maps'
export type * from './setting'
export type * from './task-action'

export type IUser = ILogin & MktUser & IProfile & Pick<ILoginToolResponse, 'remainingDay'>
