import { IButtonContext, ITaskName, ITaskTypes } from '@preload/types'
import useClearLocalStorageOnVersionChange from '@renderer/hook/useClearLocalStorageOnVersionChange '
import { useReadStatusCloseChrome, useReadStatusDownload } from '@renderer/services'
import { useReadSettingHistory } from '@renderer/services/setting/useReadSettingHistory'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'

const ButtonStateContext = createContext<IButtonContext>({
  isWork: false,
  action: null,
  isPendingStop: false,
  isPendingCheck: false,
  isPendingClose: false
})

const LayoutButtonStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<IButtonContext>({
    isWork: false,
    action: null,
    isPendingStop: false,
    isPendingCheck: false,
    isPendingClose: false
  })

  useClearLocalStorageOnVersionChange()
  const { data: dataDownload } = useReadStatusDownload<ITaskTypes['check_browser']>('check_browser')
  const { data: dataHistory } = useReadSettingHistory()
  const { data: dataStop } = useReadStatusCloseChrome<ITaskTypes['stop_job']>('stop_job')
  const { data: dataClose } = useReadStatusCloseChrome<ITaskTypes['close_chrome']>('close_chrome')

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      isPendingCheck: !!dataDownload?.is_pending_check
    }))
  }, [dataDownload])

  useEffect(() => {
    let foundKey: ITaskName | null = null

    if (dataHistory) {
      for (const key in dataHistory) {
        if (dataHistory[key]?.isWork === true) {
          foundKey = key as ITaskName
          break
        }
      }
    }
    setState((prevState) => ({
      ...prevState,
      isWork: foundKey !== null,
      action: foundKey
    }))
  }, [dataHistory])

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      isPendingStop: !!dataStop?.is_pending_stop
    }))
  }, [dataStop])

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      isPendingClose: !!dataClose?.is_pending_close
    }))
  }, [dataClose])

  return <ButtonStateContext.Provider value={state}>{children}</ButtonStateContext.Provider>
}

export const useButtonStateProvider = (): IButtonContext => {
  return useContext(ButtonStateContext)
}

export default LayoutButtonStateProvider
