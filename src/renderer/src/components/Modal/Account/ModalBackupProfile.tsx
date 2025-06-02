import { ProgressLabel, ProgressRoot, ProgressSection, Text } from '@mantine/core'
import type { IProcessBackupProfile } from '@preload/types'
import { InputField } from '@renderer/components/CustomFormField'
import { ButtonFlowbite } from '@renderer/components/Default'
import { useReadSettingSystem, useShowDialog, useUpdateSettingBy } from '@renderer/services'
import { registerEventListeners, removeEventListeners } from '@renderer/utils'
import { Modal } from 'flowbite-react'
import { useFormik } from 'formik'
import { Dispatch, FC, SetStateAction, useEffect, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoFolderOpenSharp } from 'react-icons/io5'
import { toast } from 'react-toastify'

interface ModalBackupProfileProps {
  isShow: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
  listUid: string[]
}

const ModalBackupProfile: FC<ModalBackupProfileProps> = ({ isShow, setIsShow, listUid }) => {
  const idForm = useId()
  const { t } = useTranslation()
  const [loadProcessing, setLoadProcessing] = useState<boolean>(false)
  const [progress, setProgress] = useState<number | undefined>(undefined)
  const [pathProcess, setPathProcess] = useState<string>()

  // const { mutate: startAction } = useStartAction()
  const { data: settingSystem } = useReadSettingSystem()
  const { mutate: updateSettingSystem } = useUpdateSettingBy('setting_system')
  const { mutate: showDialog } = useShowDialog()

  const handleClose = (): void => {
    if (loadProcessing) {
      toast.error(t('wait_processing'))
      return
    }
    setIsShow && setIsShow(false)
  }

  const formik = useFormik<{ path: string }>({
    initialValues: { path: settingSystem?.profile_backup_path ?? '' },
    onSubmit: (values) => {
      updateSettingSystem(
        { key: 'setting_system', value: { profile_backup_path: values.path } },
        {
          onSettled: (response) => {
            if (response?.status === 'error') {
              return
            }
            // startAction(
            //   { actionName: 'backup_profile', data: listUid },
            //   {
            //     onSettled: (result) => {
            //       if (result?.status === 'error') {
            //         return
            //       }
            //       setLoadProcessing(true)
            //     }
            //   }
            // )
          }
        }
      )
    }
  })

  useEffect(() => {
    registerEventListeners('backup_profile_process', (_, progressData: IProcessBackupProfile) => {
      setProgress(progressData.progress)
      setPathProcess(progressData.filePath)

      if (progressData.progress === 100 || progressData.progress === -1) {
        setTimeout(() => {
          setProgress(undefined)
          setLoadProcessing(false)
          setPathProcess(
            progressData.progress >= 100 ? t('backup_profile_done') : t('backup_profile_error')
          )
        }, 1500)
      }
    })

    return removeEventListeners(['backup_profile_process'])
  }, [])

  return (
    <Modal show={isShow} onClose={handleClose} size="lg" className="modal">
      <Modal.Header className="px-5 py-3">
        <div className="flex flex-col">
          <p>{t('backup_profile')}</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className=" p-2 flex flex-col ">
          <form
            className="flex flex-col gap-2 justify-between"
            id={idForm}
            onSubmit={formik.handleSubmit}
          >
            <Text>
              {t('number_account_backup')} {listUid?.length ?? 0}
            </Text>
            <div
              className="flex items-center gap-4 mt-4 flex-1 w-full relative"
              onClick={(): void => {
                showDialog(
                  { type: 'folder' },
                  {
                    onSettled: (result) => {
                      if (result?.status === 'success') {
                        formik?.setFieldValue('path', result.payload?.data)
                      }
                    }
                  }
                )
              }}
            >
              <InputField
                name="path"
                title={t('link_backup')}
                placeholder=""
                className=" w-full gap-3"
                classWapper="flex-1"
                formik={formik}
                disabled
              />
              <IoFolderOpenSharp className="cursor-pointer text-[#2E8CED] cts-icon" size={30} />
            </div>
          </form>
          <div className="mt-10">
            <Text>{pathProcess ?? ''}</Text>
            {progress !== undefined && (
              <ProgressRoot size={'lg'}>
                <ProgressSection value={progress ?? 0} color="orange">
                  <ProgressLabel>{t('wait_backup_profile', { ...[progress] })}</ProgressLabel>
                </ProgressSection>
              </ProgressRoot>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
        <ButtonFlowbite
          form={idForm}
          type="submit"
          color="blue"
          disabled={loadProcessing}
          isProcessing={loadProcessing}
        >
          {t('process')}
        </ButtonFlowbite>
        <ButtonFlowbite onClick={handleClose} className="bg-red-500" disabled={loadProcessing}>
          {t('cancel')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalBackupProfile
