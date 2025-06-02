import { ITypeLocales } from '@preload/types'
import i18n, { BackendModule, use } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend'
import resourcesToBackend from 'i18next-resources-to-backend'
import { isObject, merge } from 'lodash'
import { initReactI18next } from 'react-i18next'
import { UiUtilApi } from './apis'
import { configStatic } from './config/static'
import { getLocalStore } from './helper'

const loadLocales = async (
  language: ITypeLocales,
  namespace: string
): Promise<BackendModule<object>> => {
  const defaultLocales = await import(`@renderer/assets/locales/${language}/${namespace}.json`)
  const result = await UiUtilApi.getLocales(language)
  return merge(
    {},
    defaultLocales.default,
    result.payload?.data ?? {},
    (objValue: object, srcValue: object) => {
      if (isObject(objValue) && isObject(srcValue)) {
        return merge({}, objValue, srcValue)
      }
      return objValue
    }
  )
}

// load translation using http -> see /public/locales
// learn more: https://github.com/i18next/i18next-http-backend
use(HttpBackend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  //resources that contain translated words
  .use(
    resourcesToBackend((language: ITypeLocales, namespace: string) =>
      loadLocales(language, namespace)
    )
  )
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init<HttpBackendOptions>({
    lng: getLocalStore(configStatic.keyLocal.language) ?? configStatic.lang,
    fallbackLng: getLocalStore(configStatic.keyLocal.language) ?? configStatic.lang,
    debug: false,
    load: 'languageOnly',
    backend: {
      loadPath: './src/assets/locales/{{lng}}/{{ns}}.json'
    }
  })
export default i18n
