import { ButtonFlowbite, ButtonFlowbiteProps } from '@renderer/components'
import { useExportFileBy } from '@renderer/services'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CiExport } from 'react-icons/ci'
import { toast } from 'react-toastify'

interface ButtonActionExportHistoryProps extends ButtonFlowbiteProps {
  selectedRecords?: ReadonlySet<string>
}

const ButtonActionExportHistory: FC<ButtonActionExportHistoryProps> = ({
  selectedRecords,
  ...spread
}) => {
  const { t } = useTranslation()
  const {
    //  mutate: exportFileBy,
    isPending
  } = useExportFileBy()

  const handleExportFile = async (): Promise<void> => {
    if (!selectedRecords || (selectedRecords && selectedRecords.size === 0)) {
      toast.warn(t('notifications.no_account_selected'))
      return
    }
    // exportFileBy({ type: 'history_export', listUidSelect: Array.from(selectedRecords) })
  }

  return (
    <ButtonFlowbite
      isProcessing={isPending}
      onClick={handleExportFile}
      StartIcon={CiExport}
      color="light"
      className="rounded-xl bcg-warning btn-export-account"
      size="sm"
      {...spread}
    >
      {spread?.children || t('export_file')}
    </ButtonFlowbite>
  )
}

export default ButtonActionExportHistory
