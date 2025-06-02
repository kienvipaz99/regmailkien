import { ButtonFlowbiteProps } from '@renderer/components/Default'
import { ModalSelectTypeExport } from '@renderer/components/Modal'
import { Button } from 'flowbite-react'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi'
import { toast } from 'react-toastify'

type Props = ButtonFlowbiteProps & {
  isFastExport?: boolean
  handleFastExport?: () => void
  //
}

const ButtonActionExportFile: FC<Props> = ({ handleFastExport, ...spread }) => {
  const { t } = useTranslation()
  const [isDisable, setIsDisable] = useState<boolean>(false)
  const [exporting, setExporting] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState(false)

  const handleConfirm = (): void => {
    // console.log('confirm')
  }
  useEffect(() => {
    window.electron.ipcRenderer.on('processing', () => {
      setExporting(true)
    })
    window.electron.ipcRenderer.on('export_done', () => {
      setExporting(false)
      setIsDisable(false)
      toast.success(t('export_success'))
    })
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('processing')
      window.electron.ipcRenderer.removeAllListeners('export_done')
    }
  }, [])
  return (
    <>
      <Button
        className="my-2 mt-[2px] h-max w-[200px] rounded-lg p-[2px] !px-0 shadow-sm hover:shadow-none 2xl:w-[250px]"
        color="success"
        size="sm"
        onClick={() => {
          // if (isFastExport) {
          // setIsDisable(true)
          handleFastExport?.()
          // } else {
          //   setOpenModal(true)
          // }
        }}
        disabled={exporting || isDisable}
        {...spread}
      >
        <PiMicrosoftExcelLogoFill size={20} className="mr-1" />
        {t(exporting || isDisable ? `exporting` : `export_file`)}
      </Button>
      {openModal && (
        <ModalSelectTypeExport
          isShow={openModal}
          setIsShow={setOpenModal}
          handleConfirm={handleConfirm}
        />
      )}
    </>
  )
}

export default ButtonActionExportFile
