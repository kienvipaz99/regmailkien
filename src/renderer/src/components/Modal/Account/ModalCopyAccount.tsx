import { ButtonFlowbite, InputField, SelectField } from '@renderer/components'
import { optionsFormat } from '@renderer/config'
import { useCopyAccountByField } from '@renderer/services'
import { Modal } from 'flowbite-react'
import { useFormik } from 'formik'
import { map } from 'lodash'
import { Dispatch, FC, SetStateAction, useEffect, useId } from 'react'
import { useTranslation } from 'react-i18next'

interface ModalCopyAccountProps {
  isShow: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
  accounts: string[]
}

const ModalCopyAccount: FC<ModalCopyAccountProps> = ({
  isShow,
  setIsShow,
  accounts
}): JSX.Element => {
  const { t } = useTranslation()
  const idForm = useId()
  const { mutate: copyByField } = useCopyAccountByField()

  const formik = useFormik<{
    template: string
    choose_type: Array<string>
  }>({
    initialValues: {
      template: '',
      choose_type: []
    },
    onSubmit: (values) => {
      copyByField({ key: 'uid', value: values.template, select: accounts })
      handleClose()
    }
  })

  const handleClose = (): void => setIsShow && setIsShow(false)

  useEffect(() => {
    formik?.setFieldValue('template', formik?.values?.choose_type?.join('|'))
  }, [formik?.values?.choose_type, formik?.values?.template])

  return (
    <Modal show={isShow} onClose={handleClose} size="lg" className="modal-copy">
      <form className="mb-3" id={idForm} onSubmit={formik.handleSubmit}>
        <Modal.Header className="px-5 py-3">{t('choose_account_form')}</Modal.Header>
        <Modal.Body>
          <div className="flex gap-3 flex-col overflow-inherit justify-start">
            <SelectField
              formik={formik}
              height=""
              isMulti
              name="choose_type"
              placeholder="Chọn định dạng"
              classWapper="cursor-pointer"
              options={map(optionsFormat, (option) => ({
                value: option.value,
                label: t(`account_key.${option.label}`)
              }))}
            />
            <InputField
              formik={formik}
              name="template"
              placeholder="Định dạng nhập"
              classWapper="cursor-default"
              disabled
              readOnly
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
          <ButtonFlowbite form={idForm} type="submit" color="blue">
            {t('config_menu.coppy')}
          </ButtonFlowbite>
          <ButtonFlowbite type="button" onClick={handleClose} className="bg-red-500">
            {t('cancel')}
          </ButtonFlowbite>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default ModalCopyAccount
