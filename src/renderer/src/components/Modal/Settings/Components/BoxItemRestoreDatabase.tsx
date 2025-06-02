import { ProgressLabel, ProgressRoot, ProgressSection, Text } from '@mantine/core'
import { ButtonFlowbite } from '@renderer/components'
import { queryClient } from '@renderer/context'
import { formatDate } from '@renderer/helper'
// import { useRecoverData, useShowDialog } from '@renderer/service'
import type { DefaultSettingProps } from '@renderer/types'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

interface IBoxItemRestoreDatabaseProps
  extends Pick<DefaultSettingProps, 'setIsDisable' | 'isDisable'> {
  time?: string
}

const BoxItemRestoreDatabase: FC<IBoxItemRestoreDatabaseProps> = ({
  setIsDisable,
  time,
  isDisable
}): JSX.Element => {
  const { t } = useTranslation()
  // const { mutateAsync: recoverData } = useRecoverData()
  // const { mutateAsync: showDialogAsync } = useShowDialog()
  const [progress, setProgress] = useState<number | undefined>(undefined)

  const handleDisable = (value: boolean): void => {
    setIsDisable && setIsDisable(value)
  }

  const handleRestoreData = async (): Promise<void> => {
    if (isDisable) return
    handleDisable(true)
    // const path = await showDialogAsync({ type: 'file' })
    // if (path && typeof path === 'string') {
    // toast.warn('Hệ thống đang xử lý vui lòng chờ trong giây lát')
    // await recoverData(path)
    // } else {
    // handleDisable(false)
    // }
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('progress', (_, progress: number) => {
      if (!(progress >= 100)) {
        setProgress(Number(progress.toFixed(2)))
      }
    })
    window.electron.ipcRenderer.on('backup_failed', () => {
      handleDisable(false)
      toast.error(t('notifications.back_up_failed'))
    })
    window.electron.ipcRenderer.on('recovered', () => {
      setProgress(() => undefined)
      handleDisable(false)
      queryClient.invalidateQueries()
      toast.success(t('notifications.account_sync_success'))
    })

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('recovered')
      window.electron.ipcRenderer.removeAllListeners('backup_failed')
      window.electron.ipcRenderer.removeAllListeners('progress')
    }
  }, [])

  return (
    <>
      <div className="my-4 flex items-center gap-3">
        <Text className="w-[215px] text-sm" fw={500}>
          {t('setting.restore_database')}
        </Text>
        <div className="flex items-center gap-2 w-[70%]">
          <ButtonFlowbite
            className="whitespace-nowrap w-[100px]"
            color="blue"
            size="sm"
            onClick={handleRestoreData}
            disabled={isDisable}
          >
            {t('setting.restore_db')}
          </ButtonFlowbite>
          <Text className="font-medium text-sm">
            {!time
              ? t('setting.database_not_restore')
              : `${t('setting.last_database_restore_time')} ${formatDate(time)}`}
          </Text>
        </div>
      </div>

      {progress !== undefined && (
        <ProgressRoot size={'lg'}>
          <ProgressSection value={progress ?? 0} color="orange">
            <ProgressLabel>{t('recovery', { progress: progress ?? 0 })}</ProgressLabel>
          </ProgressSection>
        </ProgressRoot>
      )}
    </>
  )
}

export default BoxItemRestoreDatabase
