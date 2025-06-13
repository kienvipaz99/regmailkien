import { configOptionConfigProxy } from '@preload/types'
import { providerLink } from '@renderer/config'
import { queriesToInvalidate, queryKeys } from '@renderer/services'
import { useCreateProxy } from '@renderer/services/proxy'
import type { ITypeProxy } from '@vitechgroup/mkt-proxy-client'
import { Button, Modal } from 'flowbite-react'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { SelectField, TextAreaField } from '../../CustomFormField'
import { ButtonFlowbite } from '../../Default'

interface IModalCreateConfigProxyProps {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  typeProxyExits: string[]
}

const ModalCreateConfigProxy = ({
  openModal,
  setOpenModal,
  typeProxyExits
}: IModalCreateConfigProxyProps): JSX.Element => {
  const idForm = useId()
  const { t } = useTranslation()
  const { mutate: createProxy, isPending } = useCreateProxy()

  // Định nghĩa schema validation với Yup
  const validationSchema = Yup.object().shape({
    provider: Yup.string().required(t('provider_required')), // Bắt buộc chọn provider
    apiKey: Yup.string(), // Không bắt buộc
    proxyType: Yup.string().required(t('proxy_type_required')), // Bắt buộc chọn proxyType
    list_key: Yup.string() // Không bắt buộc
  })

  const formik = useFormik({
    initialValues: {
      provider: '',
      apiKey: '',
      proxyType: '', // Đổi thành rỗng để yêu cầu người dùng chọn
      list_key: ''
    },
    validationSchema,
    onSubmit: (values) => {
      createProxy(
        {
          apiKey: values?.apiKey,
          provider:
            values?.apiKey && values?.provider === 'proxy_mart_key'
              ? 'proxy_mart_reseller'
              : values.provider,
          list_key: values.list_key,
          proxyType: values.proxyType as ITypeProxy,
          template: '',
          formatOptions: [],
          values: ''
        },
        {
          onSettled: () => {
            queriesToInvalidate([queryKeys.proxy.readAllKeyProxy])
            setOpenModal(false)
          }
        }
      )
    }
  })

  const listV4: string[] = ['kiot_proxy', 'ww_proxy', 'net_proxy', 'tm_proxy', 'zing_proxy']
  const listV6: string[] = ['tm_proxy', 'zing_proxy', 'proxy_v6']

  const handleSubmit = (): void => {
    if (!formik.isValid) {
      toast.error(t('invalid_form_data'), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      return
    }
    formik.handleSubmit()
  }

  return (
    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>{t('create_config')}</Modal.Header>
      <Modal.Body>
        <form id={idForm} className="space-y-3 mb-3" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            <p>{t('supplier')}</p>
            <div className="flex gap-3">
              <SelectField
                formik={formik}
                name="provider"
                options={configOptionConfigProxy?.map((option) => ({
                  ...option,
                  isDisabled: typeProxyExits?.includes(option.value)
                }))}
                classWapper="flex flex-col w-full"
              />
              {formik?.values?.provider !== '' && (
                <ButtonFlowbite color="failure" className="whitespace-nowrap">
                  <Link to={providerLink[formik.values.provider]} target="_blank">
                    {t('register')}
                  </Link>
                </ButtonFlowbite>
              )}
            </div>

            <div className="flex-1">
              <p>{t('API Key')}</p>
              <TextAreaField
                name="apiKey"
                formik={formik}
                clsTextArea="resize-none max-h-[42px] mt-0.5"
              />
            </div>

            <div className="flex items-end gap-5">
              <div className="flex-1">
                <p>
                  {t('proxy_type')}
                  <strong className="text-red-500">*</strong>
                </p>
                <SelectField
                  formik={formik}
                  name="proxyType"
                  options={[
                    ...(formik?.values?.provider === 'proxy_mart_key'
                      ? [
                          { value: 'key_proxy', label: 'Key Proxy' },
                          { value: 'v6_rotate', label: 'Proxy xoay' }
                        ]
                      : []),
                    ...(listV4.includes(formik?.values?.provider)
                      ? [{ value: 'v4_rotate', label: 'Proxy v4' }]
                      : []),
                    ...(listV6.includes(formik?.values?.provider)
                      ? [{ value: 'v6_rotate', label: 'Proxy v6' }]
                      : []),
                    ...(formik?.values?.provider === 'shared_key_pool'
                      ? [{ value: 'v4_rotate', label: 'Proxy v4' }]
                      : [])
                  ]}
                  classWapper="flex flex-col w-full"
                />
              </div>
            </div>

            <div className="flex-col flex gap-[7px] w-full">
              <p>{t('enter_key')}</p>
              <TextAreaField
                formik={formik}
                name={`list_key`}
                placeholder={t('each_key_has1_line')}
                clsTextArea="h-[250px] bg-[#ffff] !px-2"
              />
            </div>
          </div>
        </form>
      </Modal.Body>

      <div className="flex items-center justify-center p-4">
        <Button
          form={idForm}
          type="button"
          color="blue"
          isProcessing={isPending}
          disabled={isPending}
          onClick={handleSubmit}
          className="btn-add-account"
        >
          {t('save')}
        </Button>
      </div>
    </Modal>
  )
}

export default ModalCreateConfigProxy
