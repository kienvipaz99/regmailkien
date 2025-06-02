import { FormikProps } from 'formik'
import { useEffect } from 'react'
import { localStorageUtil } from '../utils'
type useDraftLocalModalSettingProps<T> = {
  key: string
  formik?: FormikProps<T>
}
export const useDraftLocalModalSetting = <T>({
  formik,
  key
}: useDraftLocalModalSettingProps<T>): void => {
  useEffect((): void => {
    const localValue = localStorageUtil.getItem('settings') ?? {}
    localStorageUtil.setItem('settings', { ...localValue, [key]: formik?.values })
  }, [formik?.values])
}
