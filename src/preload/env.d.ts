/// <reference types="vite/client" />

interface ImportMetaEnv {
  // all available
  readonly VITE_VERSION_APP: string
  readonly VITE_LAST_UPDATED_APP: string

  // only main process available
  readonly MAIN_VITE_USERNAME_MKT: string
  readonly MAIN_VITE_PASSWORD_MKT: string

  // only main process available
  readonly MAIN_VITE_APP_NAME: string
  readonly MAIN_VITE_APP_ID: string
  readonly MAIN_VITE_APPLE_ID: string
  readonly MAIN_VITE_APP_AUTHOR: string
  readonly MAIN_VITE_APP_TITLE: string
  readonly MAIN_VITE_BASE_URL_APP_KEY: string
  readonly MAIN_VITE_URL_APP_KEY: string
  readonly MAIN_VITE_MASP: string
  readonly MAIN_VITE_KEY_256: string
  readonly MAIN_VITE_KEY_API_MAIL_INBOXES: string
  readonly MAIN_VITE_TOKEN_CHECK_IP: string
  readonly MAIN_VITE_GET_TOKEN_FB_LITE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
