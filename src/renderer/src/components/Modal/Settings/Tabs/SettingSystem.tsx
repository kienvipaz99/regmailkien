import type { ISettingSystem } from '@preload/types'
import InputGroupCheckboxNumber from '@renderer/components/CustomFormField/InputGroupCheckboxNumber'
import SelectField from '@renderer/components/CustomFormField/SelectField'
import GroupTitle from '@renderer/components/GroupTitle'
import { useReadSettingSystem, useUpdateSettingBy } from '@renderer/services'
import type { DefaultSettingProps } from '@renderer/types'
import { optionsColumns } from '@renderer/utils/func'
import { defaultSettingSystem } from '@renderer/utils/init'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const SettingSystem = ({
  formId,
  handleClosed,
  currentButton
}: DefaultSettingProps): JSX.Element => {
  const { t } = useTranslation()
  const { mutate: updateSettings } = useUpdateSettingBy('setting_system')
  const { data: dataSetting, isFetched } = useReadSettingSystem()

  const formik = useFormik<ISettingSystem>({
    initialValues: defaultSettingSystem,
    onSubmit(values) {
      updateSettings(
        { key: 'setting_system', value: values },
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

  useEffect(() => {
    if (formik && !isEmpty(dataSetting)) {
      formik.setValues(dataSetting as ISettingSystem)
    }
  }, [dataSetting, isFetched])

  return (
    <form id={formId} onSubmit={formik?.handleSubmit}>
      <GroupTitle title={t('setting.setting_thread')} hr />
      <div className="px-6 my-[35px] space-y-3">
        <InputGroupCheckboxNumber
          formik={formik}
          config={{
            nameInputOne: 'threads_run'
          }}
          configLabel={{
            label: t('setting.thread_run'),
            props: {
              className: 'font-medium'
            }
          }}
          suffix={t('setting.thread_recommended', { ...[formik?.values?.max_threads_run ?? 0] })}
          classWapper="w-full [&>:first-child]:w-[45%]"
        />

        <InputGroupCheckboxNumber
          formik={formik}
          config={{
            nameInputOne: 'thread_proxy'
          }}
          configLabel={{
            label: t('setting.thread_proxy'),
            props: {
              className: 'font-medium w-[45%]'
            }
          }}
          suffix={`${t('setting.thread')}/ip`}
          classWapper="w-full [&>:first-child]:w-[45%]"
        />
      </div>

      <GroupTitle title={t('setting.general_setting')} hr />
      <div className="px-6 my-[35px]">
        <div className="flex flex-col gap-5 mt-5 [&>*]:flex [&>*]:items-center">
          <SelectField
            name="chrome_columns.columns"
            placeholder={t('choose')}
            label={t('setting.chrome_per_row')}
            classWapper="!items-center w-full [&>:last-child]:w-[300px]"
            height="38px"
            options={optionsColumns}
            formik={formik}
            clsLabelWrapper="!mb-0 w-[45%] mr-3 font-medium"
          />

          <SelectField
            name="chrome_delay.type"
            placeholder={t('choose')}
            height="38px"
            label={t('setting.delay_open_and_close')}
            classWapper="!items-center w-full [&>:last-child]:w-[300px]"
            clsLabelWrapper="!mb-0 w-[45%] mr-3 font-medium"
            options={[
              {
                value: 'delay',
                label: t('delay')
              },
              {
                value: 'not_delay',
                label: t('not_delay')
              }
            ]}
            formik={formik}
          />

          {/* <SelectField
            name="get_token.type"
            placeholder="Chọn"
            label={t('setting.auto_get_token_account')}
            classWapper="!items-center w-full [&>:last-child]:w-[300px]"
            height="38px"
            options={optionsTokens}
            formik={formik}
            clsLabelWrapper="!mb-0 w-[45%] mr-3 font-medium"
          />

          <SwitchField
            name="is_login_cookies.is_use"
            formik={formik}
            label={t('setting.login_with_cookie')}
            labelPosition="left"
            classCheckBox={'font-medium [&>:last-child]:w-[45%] w-full gap-3'}
            classWapper="w-full"
            checked={!!formik?.values?.is_login_cookies?.is_use}
            onChange={() => {
              formik &&
                formik.setFieldValue(
                  'is_login_cookies.is_use',
                  !formik?.values?.is_login_cookies?.is_use
                )
            }}
          />

          <SwitchField
            name="is_auto_get_cookies.is_use"
            formik={formik}
            label={t('setting.auto_get_cookie_account')}
            labelPosition="left"
            classCheckBox={'font-medium [&>:last-child]:w-[45%] w-full gap-3'}
            classWapper="w-full"
            checked={!!formik?.values?.is_auto_get_cookies?.is_use}
            onChange={() => {
              formik &&
                formik.setFieldValue(
                  'is_auto_get_cookies.is_use',
                  !formik?.values?.is_auto_get_cookies?.is_use
                )
            }}
          />

          <SwitchField
            name="is_login_facebook_with_email"
            formik={formik}
            label={t('setting.login_with_email')}
            labelPosition="left"
            classCheckBox={'font-medium [&>:last-child]:w-[45%] w-full gap-3'}
            classNameLabel="w-[45%]"
            classWapper="w-full"
            checked={formik?.values?.is_login_facebook_with_email}
            onChange={() => {
              formik?.setFieldValue(
                'is_login_facebook_with_email',
                !formik?.values?.is_login_facebook_with_email
              )
            }}
          /> */}
          {/* <InputShowDialog name="backup.path" formik={formik} /> */}
        </div>
      </div>
    </form>
  )
}

export default SettingSystem
