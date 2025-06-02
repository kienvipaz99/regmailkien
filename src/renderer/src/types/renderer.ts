/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AppSettings,
  ISetConfigPagination,
  ISettingSystem,
  ITaskName,
  TColumnsTable
} from '@preload/types'
import { ITypeProxy } from '@vitechgroup/mkt-proxy-client'
import { FormikProps } from 'formik'
import { TFunction } from 'i18next'
import { Dispatch, SetStateAction } from 'react'
import { ObjectId } from 'typeorm'
import { IPayloadService } from './payload'
import { CustomSelectProps } from './table'

export type optionSelect = {
  label: string | number
  value: any
  originValue?: any
}

export interface IModalDefault<T> {
  formik?: FormikProps<T>
  isShow?: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
}

export interface IFieldFormCustom<T> {
  name: string
  formik?: FormikProps<T>
  msgError?: string
}

export interface IAuthContext {
  user?: AppSettings['user']
}

export type ICategoryType = 'group' | 'post' | 'account'

export type IParams =
  | number
  | number[]
  | string
  | string[]
  | boolean
  | boolean[]
  | Date
  | ObjectId
  | undefined
  | null

export type IObjectParams = {
  search?: IParams
  searchCate?: IParams
  categoryId?: string[] | undefined
  page?: number
  pageSize?: number
  job_id?: string
  job_detail_id?: string
  filterType?: 'live' | 'die' | 'all'
  uids?: string[]
  names?: string[]
  checkpointState?: string[]
  category_type?: ICategoryType
  is_show?: boolean
  provinceId?: number
  proxyType?: ITypeProxy[]
}

export type IDispatchState<T> = Dispatch<SetStateAction<T>>

export type refSelect = {
  setOptions: Dispatch<SetStateAction<optionSelect[]>>
  options: optionSelect[]
  renderOption?: (data: any[]) => optionSelect[]
  renderOptionUniq?: (data: any | any[]) => void
}

export interface SelectScrollBaseProps extends Omit<CustomSelectProps<any>, 'name'> {
  name?: string
  params?: any
  enabled?: boolean
  isDisableBehavior?: boolean
  funRecall?: (data: any[]) => void
  funCustomValue?: (value: any, options: any[]) => optionSelect[]
  type?: ICategoryType
}

export interface IToggleValues {
  value: string
  array: string[]
}

export type ITableDefaultValue<T, SL = string> = {
  selectedRows?: ReadonlySet<SL>
  onSelectedRowsChange?: IDispatchState<ReadonlySet<SL>>
  data?: T[]
  total?: number
  t: TFunction<any, any>
  actionType?: ITaskName
  page?: number
  rowKeyGetter?: string
  settingSystem?: ISettingSystem
  pageSize?: number
  clsTable?: string
  columns?: TColumnsTable<T>
  setConfigPagination?: IDispatchState<ISetConfigPagination>
  payloadPending?: IButtonContext
  fetching?: boolean
} & IPayloadService

export interface DefaultSettingProps {
  formId?: string
  handleClosed?: () => void
  setIsDisable?: IDispatchState<boolean>
  isDisable?: boolean
  formik?: FormikProps<any>
  idForm?: string
  currentButton?: string
}

export type IButtonContext = {
  isWork: boolean
  isPendingStop: boolean
  isPendingCheck: boolean
  isPendingClose: boolean
  action: ITaskName | null
}

export type IOptionSelectFormat<T> = { readonly label: string; readonly value: T }

export interface IModalAddPost {
  isShow?: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
  listUid?: string[]
}

export type IPropsFormGeneric<T> = {
  formik?: FormikProps<T>
  activeTab?: boolean
  handleGetScripts?: IOptionSelectFormat<string>[]
}

export interface TabConfig {
  id: string
  title: string
  content: (props: IPropsFormGeneric<any>) => JSX.Element
  disabled?: boolean
  formik?: FormikProps<any>
}
