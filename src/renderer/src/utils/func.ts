import { IpcRendererListener } from '@electron-toolkit/preload'
import { Account, Category, IKeyMessageWorker, LogDetail, optionSelect } from '@preload/types'
import type { JobDetail } from '@vitechgroup/mkt-job-queue'
import { FormikProps } from 'formik'
import { TFunction, TFunctionNonStrict } from 'i18next'
import { get, includes, isEmpty, map, split, trim, zipObject } from 'lodash'
import { toast } from 'react-toastify'

const arrays = Array(5)
  .fill('')
  .map(
    (_, index): optionSelect => ({
      value: index + 2,
      label: `${index + 2}`
    })
  )

const arrays_tokens = Array(2)
  .fill('')
  .map(
    (_, index): optionSelect => ({
      value: index === 0 ? 'EAAG' : 'EAAB',
      label: index === 0 ? 'EAAG...' : 'EAAB...'
    })
  )

export const optionsColumns: Array<optionSelect> = arrays
export const optionsTokens: Array<optionSelect> = arrays_tokens

export const extractKeys = (
  inputString: string | null,
  t: TFunction<['translation', ...string[]], undefined>
): string => {
  if (inputString && !includes(inputString, '-->')) {
    t(`course_of_action.${trim(inputString)}`)
  }
  const parts = split(inputString, '-->')
  if (parts.length === 2) {
    return parts.map((part) => t(`course_of_action.${trim(part)}`)).join(' --> ')
  }
  return '-'
}

export const unZipAccount = (
  template: string,
  template_sep: string,
  data: string,
  isAddCategory = false,
  category?: string
): Account[] => {
  const keys = split(template.trim(), template_sep).map((i) => i.trim())
  const datas = trim(data).split('\n')
  return map(datas, (value): Account => {
    const attributes = value.split(template_sep)
    const accountData = zipObject(keys, attributes) as unknown as Account
    if (isAddCategory) {
      attributes.push('category')
      accountData.category = category as unknown as Category
    }
    // if (accountData._2fa) accountData._2fa = words(accountData._2fa).join('').toUpperCase()
    return accountData
  })
}

export function checkSelection(
  valueSelected: string[],
  t?: TFunction<'translation', undefined>,
  keyTranslate?: string,
  warnings?: { multiple: boolean }
): boolean {
  if (isEmpty(valueSelected)) {
    toast.warn(t && t(keyTranslate ?? 'notifications.no_account_selected'))
    return false
  } else if (valueSelected.length > 1 && warnings?.multiple) {
    toast.warn(t && t('notifications.please_choose_one'))
    return false
  }
  return true
}

export const registerEventListeners = (
  key: IKeyMessageWorker,
  listener: IpcRendererListener
): void => {
  window.electron.ipcRenderer.on(key, listener)
}

export const removeEventListeners = (listKey: Array<IKeyMessageWorker>): (() => void) => {
  return (): void => {
    listKey.map((key) => window.electron.ipcRenderer.removeAllListeners(key))
  }
}

export const findJobDetail = (
  uid: string,
  listJobDetail: JobDetail[] = []
): JobDetail | undefined => {
  return listJobDetail.find((jobDetail) => {
    if (!jobDetail.data) {
      return
    }
    const data = JSON.parse(jobDetail.data)
    return data.uidAccount === uid
  })
}

// export const translationLogProcessRun = (
//   t?: TFunctionNonStrict<'translation', undefined>,
//   logRunning?: string,
//   target?: string
// ): string => {
//   try {
//     if (!t || !logRunning) {
//       return '-'
//     }

//     const { mess = '', uidTarget } = JSON.parse(logRunning ?? '{}') as LogDetail

//     const [key, ...logParts] = mess.split('|')

//     if (target && uidTarget !== target) {
//       return '-'
//     }

//     return t(`log_process_run.${key}`, {
//       ampersand: '&',
//       interpolation: { escapeValue: false },
//       ...logParts
//     })
//   } catch (e) {
//     return ''
//   }
// }
interface HandleSyncDataModalSettingsProps<T> {
  isFetched: boolean
  nameTab: string
  dataSetting: T
  formik: FormikProps<T>
}
export const getDraftValueModalSetting = <T>(key: string): T => {
  return get(localStorageUtil.getItem('settings'), key)
}
export const handleSyncDataModalSettings = <T>({
  isFetched,
  nameTab,
  dataSetting,
  formik
}: HandleSyncDataModalSettingsProps<T>): void => {
  const isFirstMount = get(localStorageUtil.getItem('modal_settings_mount_tabs'), nameTab)

  if (isFetched) {
    if (isFirstMount) {
      if (dataSetting) {
        formik.setValues(dataSetting)
      }

      requestAnimationFrame(() => {
        localStorageUtil.setItem('modal_settings_mount_tabs', {
          ...(localStorageUtil.getItem('modal_settings_mount_tabs') ?? {}),
          [nameTab]: false
        })
      })
    } else {
      const draftValues = getDraftValueModalSetting(nameTab)
      if (draftValues) {
        formik.setValues(draftValues as T)
      }
    }
  }
}
export const translationLogProcessRun = (
  t?: TFunctionNonStrict<'translation', undefined>,
  logRunning?: string,
  target?: string
): { text: string; key: string } => {
  try {
    if (!t || !logRunning) {
      return { text: '-', key: '' }
    }

    const { mess = '', uidTarget } = JSON.parse(logRunning ?? '{}') as LogDetail
    const [key, ...logParts] = mess.split('|')

    if (target && uidTarget !== target) {
      return { text: '-', key: '' }
    }

    return {
      text: t(`log_process_run.${key}`, {
        ampersand: '&',
        interpolation: { escapeValue: false },
        ...logParts
      }),
      key
    }
  } catch (e) {
    return { text: '', key: '' }
  }
}

export const localStorageUtil = {
  setItem: (key: string, value: unknown | { [key: string]: unknown }): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage', error)
    }
  },
  getItem: <T>(key: string): T | null => {
    try {
      const value = localStorage.getItem(key)
      return value ? (JSON.parse(value) as T) : null
    } catch (error) {
      console.error('Error reading from localStorage', error)
      return null
    }
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key)
  }
}
export const convertTimestampToDate = (input: number | string | null | Date): string => {
  if (!input) {
    return ''
  }

  let date: Date

  if (typeof input === 'string' && !/^\d+$/.test(input)) {
    date = new Date(input)
  } else {
    date = new Date(Number(input))
  }

  if (isNaN(date.getTime())) {
    return ''
  }

  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yy = String(date.getFullYear())
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')

  return `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`
}
