/* eslint-disable prettier/prettier */
import {
  Account,
  IResponsePayload,
  ITaskName,
  registerEventListeners,
  removeEventListeners
} from '@preload/types'
import {
  queriesToInvalidate,
  queryKeys,
  useReadAccountByParams,
  useReadActionBy,
  useReadHistoryBy,
  useStartAction,
  useUpdateSettingBy
} from '@renderer/services'
import { IObjectParams } from '@renderer/types'
import type { JobDetail } from '@vitechgroup/mkt-job-queue'
import { FormikProps, FormikValues, useFormik } from 'formik'
import { TFunction } from 'i18next'
import { omit } from 'lodash'
import { Dispatch, SetStateAction, useEffect, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

type UseCustomFormik<T> = {
  ACTION_TYPE: ITaskName
  defaultValues: T
  customValues?: Partial<T>
}

type IFormikCustom<T> = {
  t: TFunction<string, undefined>
  idForm: string
  formik: FormikProps<T>
  dataAccount: IResponsePayload<Account[]> | undefined
  dataHistory: JobDetail[]
  configSearch: IObjectParams
  setConfigSearch: Dispatch<SetStateAction<IObjectParams>>
  selectedRecords: ReadonlySet<string>
  setSelectedRecords: Dispatch<SetStateAction<ReadonlySet<string>>>
  isFetchingData: boolean
  isPendingStart: boolean
  configSearchScan: IObjectParams
  setConfigSearchScan: Dispatch<SetStateAction<IObjectParams>>
  selectedRecordsScan: ReadonlySet<string>
  setSelectedRecordsScan: Dispatch<SetStateAction<ReadonlySet<string>>>
}

const useCustomFormik = <T extends FormikValues>({
  ACTION_TYPE,
  defaultValues,
  customValues
}: UseCustomFormik<T>): IFormikCustom<T> => {
  const idForm = useId()
  const { t } = useTranslation()

  const [selectedRecords, setSelectedRecords] = useState((): ReadonlySet<string> => new Set())
  const [configSearch, setConfigSearch] = useState<IObjectParams>({
    page: 1,
    pageSize: 1000,
    filterType: 'all'
  })

  const [selectedRecordsScan, setSelectedRecordsScan] = useState(
    (): ReadonlySet<string> => new Set()
  )
  const [configSearchScan, setConfigSearchScan] = useState<IObjectParams>({
    page: 1,
    pageSize: 1000
  })

  const { data: dataHistory } = useReadHistoryBy({ actionName: ACTION_TYPE })
  const { data: dataAction } = useReadActionBy<T>({ key: ACTION_TYPE, select: '' })
  const { data: dataAccount, isFetching: isFetchingData } = useReadAccountByParams(configSearch)

  const { mutate: updateSettings } = useUpdateSettingBy(undefined, false)

  const { mutate: startAction, isPending: isPendingStart } = useStartAction()

  const formik = useFormik<T>({
    initialValues: defaultValues,
    onSubmit: async (values) => {
      // if (isEmpty(selectedRecords)) {
      //   toast.warn(t('notifications.no_account_selected'))
      //   return
      // }

      const selectedValues = Array.from(selectedRecords.values())
      const newValues = omit(values, Object.keys(customValues || {}))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const submitValues = { ...customValues, ...newValues } as any
      console.log(submitValues, 'submitValues')

      updateSettings(
        { key: ACTION_TYPE, value: submitValues },
        {
          onSettled: (result) => {
            if (result?.status !== 'success') {
              toast.error('Lưu cấu hình thất bại')
              return
            }

            startAction({ data: selectedValues, actionName: ACTION_TYPE })
          }
        }
      )
    }
  })
  useEffect(() => {
    if (dataAction) {
      const mergedValues = { ...defaultValues, ...dataAction }
      formik.setValues(mergedValues)
    }
  }, [dataAction])

  useEffect(() => {
    registerEventListeners('wait_close_all_chrome', () =>
      queriesToInvalidate([
        queryKeys.action.readStatusCloseChrome,
        queryKeys.setting.readSettingHistory
      ])
    )
    registerEventListeners('wait_stop_all_job', () =>
      queriesToInvalidate([
        queryKeys.action.readStatusCloseChrome,
        queryKeys.setting.readSettingHistory
      ])
    )

    registerEventListeners('job_action_finally', (_, action) => {
      toast.success(`Hành động ${t(`${action}`)} hoàn thành`)
      queriesToInvalidate([
        queryKeys.action.readStatusCloseChrome,
        queryKeys.setting.readSettingHistory
      ])
    })

    registerEventListeners('log_update', () => {
      queriesToInvalidate([queryKeys.action.readHistoryBy])
    })

    registerEventListeners('read_config_again', () => {
      queriesToInvalidate([queryKeys.action.readActionBy])
    })

    registerEventListeners('read_data_account_again', () => {
      queriesToInvalidate([queryKeys.account.readAllByParams])
    })

    registerEventListeners('read_data_g_map', () => {
      queriesToInvalidate([queryKeys.gMap.readAllByParams])
    })

    registerEventListeners('export_excel_success', () => {
      toast.success(`Xuất dữ liệu thành công!`)
    })

    registerEventListeners('read_data_account_gmail', () => {
      queriesToInvalidate([queryKeys.accountGmail.readAll])
    })

    return removeEventListeners([
      'wait_close_all_chrome',
      'read_data_account_gmail',
      'wait_stop_all_job',
      'job_action_finally',
      'log_update',
      'read_config_again',
      'read_data_account_again'
    ])
  }, [])

  return {
    t,
    formik,
    idForm,
    dataAccount,
    configSearch,
    isPendingStart,
    isFetchingData,
    selectedRecords,
    setConfigSearch,
    setSelectedRecords,
    dataHistory: dataHistory ?? [],
    configSearchScan,
    setConfigSearchScan,
    selectedRecordsScan,
    setSelectedRecordsScan
  }
}

export default useCustomFormik
