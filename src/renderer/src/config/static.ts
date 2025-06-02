import { router } from './site'

export const configStatic = {
  router,
  lang: 'vi',
  languageList: [
    { code: 'vi', name: 'Việt Nam' },
    { code: 'en', name: 'English' }
  ],
  keyLocal: {
    language: 'i18nextLng'
  }
}
