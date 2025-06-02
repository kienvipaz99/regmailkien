import { ButtonFlowbite, ButtonFlowbiteProps } from '@renderer/components'
// import { useExportPostFile } from '@renderer/service'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CiExport } from 'react-icons/ci'
import { toast } from 'react-toastify'

interface ButtonActionExportContentManagementProps extends ButtonFlowbiteProps {
  selectedRecords?: ReadonlySet<string>
}

const ButtonActionExportContentManagement: FC<ButtonActionExportContentManagementProps> = ({
  selectedRecords,
  ...spread
}) => {
  const { t } = useTranslation()
  // const { mutate: exportPost, isPending: isPendingAccount } = useExportPostFile()

  const handleExportFile = async (): Promise<void> => {
    // if (isPendingAccount) return
    if (!selectedRecords || (selectedRecords && selectedRecords.size === 0)) {
      toast.warn(t('notifications.no_account_selected'))
      return
    }
    // exportPost(Array.from(selectedRecords))
  }

  return (
    <ButtonFlowbite
      onClick={handleExportFile}
      StartIcon={CiExport}
      color="light"
      className="rounded-xl bcg-warning"
      size="sm"
      // isProcessing={isPendingAccount}
      {...spread}
    >
      {spread?.children || t('export_file')}
    </ButtonFlowbite>
  )
}

export default ButtonActionExportContentManagement
