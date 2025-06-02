import type { ISettingSystem } from '@preload/types'
import type { JobDetail } from '@vitechgroup/mkt-job-queue'
import { FormikProps } from 'formik'
import { TFunction } from 'i18next'
import { Dispatch, HTMLAttributes, ReactNode, SetStateAction } from 'react'
import { Props } from 'react-select'

export interface ITableData {
  t: TFunction<string, undefined>
  dataHistory: JobDetail[]
  settingSystem?: ISettingSystem
  dataJobDetail?: JobDetail[]
}

export interface CustomSelectProps<T> extends Props, Omit<WapperLabelFormProps, 'children'> {
  className?: string
  height?: string
  name: string
  formik?: FormikProps<T>
  msgError?: string
  changeSelected?: (selected?: Record<string, string>) => void
  setValueSearch?: Dispatch<SetStateAction<string>>
  positionMenu?: string
}

export interface WapperLabelFormProps {
  classWapper?: HTMLAttributes<HTMLDivElement>['className']
  label?: string
  clsLabelWrapper?: string
  isRequired?: boolean
  children?: ReactNode
  isVertical?: boolean
}
