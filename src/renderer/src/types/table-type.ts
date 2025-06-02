import { PaginationRootProps } from '@mantine/core'
import { Dispatch, Key, ReactNode, SetStateAction } from 'react'
import { ColumnOrColumnGroup, DataGridProps } from 'react-data-grid'

export type TColumnsTable<T = unknown, SR = unknown> = readonly ColumnOrColumnGroup<
  NoInfer<T>,
  NoInfer<SR>
>[]

export interface IPaginationParams {
  pageSize?: number
  page?: number
}

export interface IObjectDynamic {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface ISetConfigPagination extends IPaginationParams, IObjectDynamic {}

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

export interface IPaginationText {
  from?: number
  to?: number
}

export interface ICalculatorTotalPage extends IPaginationParams {
  total?: number
}

export interface IPaginationTextFunc extends IPaginationText, Pick<ICalculatorTotalPage, 'total'> {}
export type Maybe<T> = T | undefined | null
export interface IReactTableGridCustom<T = unknown, SR = unknown, K extends Key = Key>
  extends Omit<DataGridProps<T, SR, K>, 'rows' | 'rowKeyGetter'>,
    ICalculatorTotalPage {
  classNameWapperTable?: string
  classNamePaginationTable?: string
  hiddenPagination?: boolean
  hiddenSTT?: boolean
  data?: T[]
  /** Nếu hàm onChange nên dùng useCallback */
  onChange?: Pick<PaginationRootProps, 'onChange'>['onChange']
  setConfigPagination?: Dispatch<SetStateAction<ISetConfigPagination>>
  /** Nếu hàm rowKeyGetter nên dùng useCallback*/
  rowKeyGetter?: string | Maybe<(row: NoInfer<T>) => K>
  hiddenPaginationText?: boolean
  /** dùng hàm paginationText nên dùng useCallback*/
  paginationText?: (obj: IPaginationTextFunc) => ReactNode
  listPageSize?: string[]
  fetching?: boolean
}

export interface refTablePaginationClient extends Required<IPaginationParams> {
  setConfigSearch: Dispatch<SetStateAction<ISetConfigPagination>>
  resetPagition: (conditional?: boolean) => void
}
