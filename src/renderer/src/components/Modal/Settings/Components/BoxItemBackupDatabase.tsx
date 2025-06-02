import { Text } from '@mantine/core'
import { ButtonFlowbite } from '@renderer/components'
import { formatDate } from '@renderer/helper'
import type { DefaultSettingProps } from '@renderer/types'
import { FC, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

interface IBoxItemBackupDatabaseProps
  extends Pick<DefaultSettingProps, 'setIsDisable' | 'isDisable'> {
  timeBackup?: string
}

const BoxItemBackupDatabase: FC<IBoxItemBackupDatabaseProps> = ({
  setIsDisable,
  timeBackup,
  isDisable
}): JSX.Element => {
  const { t } = useTranslation()
  // const { mutateAsync: backUpData } = useBackUpData()
  const timer = useRef<NodeJS.Timeout>()

  const handleDisable = (value: boolean): void => {
    setIsDisable && setIsDisable(value)
  }

  const handleBackupData = async (): Promise<void> => {
    if (isDisable) return
    handleDisable(true)
    // const isBackup = await backUpData()
    // handleDisable(isBackup)
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('back_up_done', () => {
      handleDisable(false)
      toast.success(t('notifications.back_up_done'))
      // queriesToInvalidate([queryKeys.settings.read])
    })

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('back_up_done')
      timer.current && clearTimeout(timer.current)
    }
  }, [])

  return (
    <>
      <div className="my-4 flex items-center gap-3">
        <Text className="w-[215px] text-sm" fw={500}>
          {t('setting.backup_database')}
        </Text>
        <div className="flex items-center gap-2 w-[70%]">
          <ButtonFlowbite
            className="whitespace-nowrap w-[90px]"
            color="blue"
            size="sm"
            onClick={handleBackupData}
            disabled={isDisable}
          >
            {t('setting.backup_db')}
          </ButtonFlowbite>
          <Text className="font-medium text-sm">
            {!timeBackup ? t('setting.database_not_backup') : formatDate(timeBackup)}
          </Text>
        </div>
      </div>
    </>
  )
}

export default BoxItemBackupDatabase
