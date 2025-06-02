import type { ISettingAPI } from '@preload/types'
import CustomButtonSelect from '@renderer/components/CustomButtonSelect'
import InputField from '@renderer/components/CustomFormField/InputField'
import ButtonFlowbite from '@renderer/components/Default/ButtonFlowbite'
import FormatOptionItem from '@renderer/components/FormatOptionItem'
import GroupTitle from '@renderer/components/GroupTitle'
import { configApiCaptcha, configApiSim } from '@renderer/config/schema'
import { useReadSettingApi, useUpdateSettingBy } from '@renderer/services'
import type { DefaultSettingProps, IOptionSelectFormat } from '@renderer/types'
import { defaultSettingApi } from '@renderer/utils/init'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IoIosClose } from 'react-icons/io'

const SettingApi = ({ formId, handleClosed, currentButton }: DefaultSettingProps): JSX.Element => {
  handleClosed
  const { t } = useTranslation()
  const { mutate: updateSettings } = useUpdateSettingBy('setting_api')
  const { data: dataSetting, isFetched } = useReadSettingApi()

  const formik = useFormik<ISettingAPI>({
    initialValues: defaultSettingApi,
    onSubmit(values) {
      updateSettings(
        { key: 'setting_api', value: values },
        {
          onSettled: (result) => {
            result?.status === 'success' &&
              currentButton === 'save_close' &&
              handleClosed &&
              handleClosed()
          }
        }
      )
    }
  })

  const renderApiSection = (
    sectionKey: keyof ISettingAPI,
    configOptions: IOptionSelectFormat<string>[]
  ): JSX.Element => {
    return (
      <div className="px-6 my-3">
        <GroupTitle title={t(`setting.setting_api`) + ` ` + `${sectionKey}`} hr />
        <div className="flex gap-2 flex-col mt-2">
          {formik.values?.[sectionKey]?.valuesApi.map((value, index: number) => (
            <div key={`${sectionKey}-${value}`} className="flex items-center gap-5">
              <FormatOptionItem className="min-w-[50px] w-[200px]" classWapper="relative">
                {t(`${value}`)}
                <div
                  className="-top-1 -right-1 absolute bg-gray-100 shadow-sm text-gray-500 transition-all duration-75 rounded-full"
                  onClick={() => {
                    const newOptions = [...(formik.values?.[sectionKey]?.valuesApi ?? [])]
                    newOptions.splice(index, 1)
                    formik.setFieldValue(`${sectionKey}.valuesApi`, newOptions)
                  }}
                >
                  <IoIosClose size={15} />
                </div>
              </FormatOptionItem>

              <InputField
                name={`${sectionKey}.${value}.list_key`}
                placeholder={`${t('enter_api_key')} ${t(`${value}`)}`}
                classWapper="flex-1"
                className="h-[30px]"
                value={formik.values?.[sectionKey]?.[`${value}`]?.list_key || ''}
                onChange={formik.handleChange}
              />

              <ButtonFlowbite type="button" color="failure" size="xs">
                {t('check')}
              </ButtonFlowbite>
            </div>
          ))}

          <CustomButtonSelect
            options={configOptions}
            prefix=""
            values={formik.values?.[sectionKey]?.valuesApi}
            onChange={(value) => {
              if (value) {
                const newOptions = [...(formik.values?.[sectionKey]?.valuesApi ?? []), value]
                formik.setFieldValue(`${sectionKey}.valuesApi`, newOptions)
              }
            }}
          />
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (!isEmpty(dataSetting)) {
      formik && formik.setValues(dataSetting as ISettingAPI)
    }
  }, [dataSetting, isFetched])

  return (
    <form id={formId} onSubmit={formik.handleSubmit}>
      {renderApiSection('captcha', configApiCaptcha)}
      {renderApiSection('phone', configApiSim)}
    </form>
  )
}

export default SettingApi
