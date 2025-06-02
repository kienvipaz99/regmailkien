import { Proxy } from '@vitechgroup/mkt-proxy-client'
import { FormikProps } from 'formik'
import { useTranslation } from 'react-i18next'
import { SelectField, TextAreaField } from '../CustomFormField'
import { ButtonFlowbite } from '../Default'

const FormUpdateProxyDynamic = ({
  formik,
  disabled,
  idForm
}: {
  formik: FormikProps<Partial<Proxy>>
  disabled: boolean
  idForm: string
}): JSX.Element => {
  const { t } = useTranslation()
  const listV4: string[] = ['kiot_proxy', 'ww_proxy', 'net_proxy', 'tm_proxy', 'zing_proxy']
  const listV6: string[] = ['tm_proxy', 'zing_proxy', 'proxy_v6']

  return (
    <div className="space-y-6">
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
              ...(formik?.values?.provider === 'proxy_mart_key' ||
              formik?.values?.provider === 'proxy_mart_reseller'
                ? [
                    { value: 'key_proxy', label: 'Key proxy' },
                    { value: 'v6_rotate', label: 'Proxy xoay' }
                  ]
                : []),
              ...(formik?.values?.provider && listV4.includes(formik?.values?.provider)
                ? [{ value: 'v4_rotate', label: 'Proxy v4' }]
                : []),
              ...(formik?.values?.provider && listV6.includes(formik?.values?.provider)
                ? [{ value: 'v6_rotate', label: 'Proxy v6' }]
                : [])
            ]}
            classWapper="flex flex-col w-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <p>{t('API Key')}</p>
          <TextAreaField
            name="apiKey"
            formik={formik}
            clsTextArea="resize-none max-h-[42px] mt-0.5"
          />
        </div>
      </div>
      <div className="flex-col flex gap-[7px] w-full">
        <p>{t('enter_key')}</p>
        <TextAreaField
          formik={formik}
          name="key"
          placeholder={t('each_key_has1_line')}
          clsTextArea="h-[250px] bg-[#ffff] !px-2"
        />
      </div>
      <ButtonFlowbite id={idForm} color="blue" type="submit" disabled={disabled}>
        {t('save')}
      </ButtonFlowbite>
    </div>
  )
}

export default FormUpdateProxyDynamic
