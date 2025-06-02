import type { AppSettings, IFieldUpdateAndCheck, IMainResponse } from '@preload/types'
import { SettingApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { t } from 'i18next'
import { camelCase, join } from 'lodash'
import { toast } from 'react-toastify'
import { queriesToInvalidate, queryKeys } from '../queryKeys'

export const useUpdateSettingBy = (
  by?: 'setting_api' | 'setting_system' | 'setting_proxy',
  isToast: boolean = true
): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IFieldUpdateAndCheck<AppSettings, object, undefined>,
  unknown
> => {
  return useMutation({
    mutationFn: SettingApi.updateSettingBy,
    onSuccess: (result) => {
      if (result.status === 'success') {
        queriesToInvalidate([queryKeys.setting[camelCase(join(['read', by], '_'))]])
      }

      isToast && toast[result.status](t(`notifications.${result.message.key}`))
    }
  })
}
