import { useEffect } from 'react'

const VERSION_KEY = 'app_version'

const useClearLocalStorageOnVersionChange = (): void => {
  const APP_VERSION = import.meta.env.RENDERER_VITE_VERSION_APP

  useEffect(() => {
    const savedVersion = localStorage.getItem(VERSION_KEY)

    if (savedVersion !== APP_VERSION) {
      localStorage.clear()
      localStorage.setItem(VERSION_KEY, APP_VERSION)
    }
  }, [])
}

export default useClearLocalStorageOnVersionChange
