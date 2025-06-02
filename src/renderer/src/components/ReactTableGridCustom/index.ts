import type { TColumnsTable } from '@renderer/types'
import { Dispatch, SetStateAction } from 'react'

export interface IPaginationParams {
  pageSize?: number
  page?: number
}

export type Maybe<T> = T | undefined | null

// helpers
export interface ICalculatorTotalPage extends IPaginationParams {
  total?: number
}

export interface ISTTParams extends IPaginationParams {}

// hooks
export interface useShowHideColumnParameter<T, SR = unknown> {
  nameLocal?: string
  /** nếu đầu vào là columns: Functions() thì nên dùng useMemo thì sẽ tối ưu hơn */
  columns: TColumnsTable<T, SR>
  ignoreColumns?: string[]
}

export interface useShowHideColumnReturn<T, SR> {
  hiddenColumns: string[]
  setHiddenColumns: Dispatch<SetStateAction<string[]>>
  columnsTable: TColumnsTable<T, SR>
  changeHiddenColumn: (key: string | string[]) => void
  newShowhideColumns: TColumnsTable<T, SR>
  locationColumns: string[]
  handleFindLocation: (
    filterColumns: TColumnsTable<T, SR>,
    locationColumns?: string[]
  ) => TColumnsTable<T, SR>
  handleChangeLocation?: (arr: string[]) => void
}
