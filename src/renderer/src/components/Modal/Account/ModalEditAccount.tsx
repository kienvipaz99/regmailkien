import type { Account } from '@preload/types'
import InputFieldEdit from '@renderer/components/CustomFormField/InputFieldEdit'
import TextAreaField from '@renderer/components/CustomFormField/TextAreaField'
import ButtonFlowbite from '@renderer/components/Default/ButtonFlowbite'
import { useReadAccountByField, useUpdateAccountByField } from '@renderer/services'
import { Modal } from 'flowbite-react'
import { useFormik } from 'formik'
import { Dispatch, FC, SetStateAction, useEffect, useId } from 'react'
import { useTranslation } from 'react-i18next'

interface ModalEditAccountProps {
  isShow: boolean
  setIsShow: Dispatch<SetStateAction<boolean>>
  uidAccount?: string[]
}

const ModalEditAccount: FC<ModalEditAccountProps> = ({ isShow, setIsShow, uidAccount }) => {
  const idForm = useId()
  const { t } = useTranslation()
  const { data: dataAccount } = useReadAccountByField([{ key: 'uid', select: uidAccount ?? [] }])
  const { mutate: updateAccount, isPending } = useUpdateAccountByField()

  const handleClose = (): void => setIsShow && setIsShow(false)

  const formik = useFormik<Partial<Account>>({
    initialValues: { uid: '' },
    onSubmit: (values) => {
      updateAccount({ key: 'uid', value: values, select: uidAccount ?? [] })
      handleClose()
    }
  })

  useEffect(() => {
    if (dataAccount && dataAccount.length) {
      formik.setValues(dataAccount[0])
    }
  }, [dataAccount])

  return (
    <Modal show={isShow} onClose={handleClose} size="lg" className="modal">
      <Modal.Header className="px-5 py-3">
        <div className="flex flex-col">
          <p>{t('edit_account')}</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className=" p-2 flex flex-col">
          <form
            className="flex flex-col gap-2 justify-between"
            id={idForm}
            onSubmit={formik.handleSubmit}
          >
            <InputFieldEdit
              className="!w-[100%]"
              name="uid"
              clsLabelWrapper="w-[350px]"
              title={t('account_key.uid')}
              clsTitle="w-[390px] text-base font-semibold text-gray-900"
              disabled
              formik={formik}
            />

            <InputFieldEdit
              clsLabelWrapper="w-[350px]"
              title={t('account_key.password')}
              name="password"
              clsTitle="w-[390px] text-base font-semibold text-gray-900"
              formik={formik}
            />

            <InputFieldEdit
              clsLabelWrapper="w-[350px]"
              title={t('account_key._2fa')}
              name="_2fa"
              clsTitle="w-[390px] text-base font-semibold text-gray-900"
              formik={formik}
            />

            <InputFieldEdit
              clsLabelWrapper="w-[350px]"
              title={t('account_key.email')}
              name="email"
              clsTitle="w-[390px] text-base font-semibold text-gray-900"
              formik={formik}
            />

            <InputFieldEdit
              clsLabelWrapper="w-[350px]"
              title={t('account_key.pass_email')}
              name="pass_email"
              clsTitle="w-[390px] text-base font-semibold text-gray-900"
              formik={formik}
            />

            <InputFieldEdit
              clsLabelWrapper="w-[350px]"
              title={t('account_key.recovery_email')}
              name="recovery_email"
              clsTitle="w-[390px] text-base font-semibold text-gray-900"
              formik={formik}
            />

            <InputFieldEdit
              clsLabelWrapper="w-[350px]"
              title={t('account_key.pass_recovery_email')}
              name="pass_recovery_email"
              clsTitle="w-[390px] text-base font-semibold text-gray-900"
              formik={formik}
            />

            <TextAreaField
              name="log_pass"
              label={t('account_key.log_pass')}
              classWapper="text-base font-semibold text-gray-900"
              rows={4}
              // classWapperWrapper="w-[250px] text-base font-semibold text-gray-900"
              clsLabelWrapper="w-[285px] text-[14px] font-semibold text-gray-900"
              clsTextArea="!w-[100%]"
              disabled
              formik={formik}
            />

            <TextAreaField
              name="note"
              label={t(`account_key.note`)}
              classWapper="text-base font-semibold text-gray-900"
              rows={4}
              // classWapperWrapper="w-[250px] text-base font-semibold text-gray-900"
              clsLabelWrapper="w-[285px] text-[14px] font-semibold text-gray-900"
              clsTextArea="!w-[100%]"
              formik={formik}
            />
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
        <ButtonFlowbite form={idForm} type="submit" color="blue" isProcessing={isPending}>
          {t('update')}
        </ButtonFlowbite>
        <ButtonFlowbite onClick={handleClose} className="bg-red-500">
          {t('cancel')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalEditAccount
