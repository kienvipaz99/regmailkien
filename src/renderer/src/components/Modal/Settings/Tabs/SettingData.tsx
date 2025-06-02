import type { ISettingSystem } from '@preload/types'
import InputShowDialog from '@renderer/components/CustomFormField/InputShowDialog'
import SwitchField from '@renderer/components/CustomFormField/SwitchField'
import GroupTitle from '@renderer/components/GroupTitle'
import { useReadSettingSystem, useUpdateSettingBy } from '@renderer/services'
import type { DefaultSettingProps } from '@renderer/types'
import { defaultSettingSystem } from '@renderer/utils/init'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BoxItemBackupDatabase, BoxItemRestoreDatabase } from '../Components'

const SettingData = ({
  formId,
  setIsDisable,
  handleClosed,
  isDisable,
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
    if (!isEmpty(dataSetting)) {
      formik.setValues(dataSetting)
    }
  }, [dataSetting, isFetched])

  return (
    <form id={formId} onSubmit={formik?.handleSubmit}>
      <GroupTitle title={t('setting.setting_data')} hr />
      <div className="px-6 my-3 ">
        <InputShowDialog
          name="profile_path"
          placeholder="C:\Program Files"
          formik={formik}
          classWapperDialog="w-full"
          label={t('setting.profile_path')}
          clsLabelWrapper="!mb-0 w-[215px] mr-3 font-medium"
          classWapper="!items-center w-full"
          type="folder"
        />
        <div className="mt-3">
          <InputShowDialog
            name="chrome_path"
            placeholder="C:\Program Files"
            formik={formik}
            classWapperDialog="w-full"
            label={t('setting.chrome_path')}
            clsLabelWrapper="!mb-0 w-[215px] mr-3 font-medium"
            classWapper="!items-center w-full"
            type="folder"
          />
        </div>
        <div className="flex items-center mt-3">
          <SwitchField
            name="backup.is_auto.is_use"
            formik={formik}
            label={t('setting.auto_backup')}
            classNameLabel="whitespace-nowrap"
            labelPosition="left"
            classCheckBox={'font-medium [&>:last-child]:w-[45%] w-full gap-3 gap-[35px]'}
            classWapper="w-full"
            checked={formik?.values?.backup?.is_auto}
            onChange={() => {
              formik?.setFieldValue('backup.is_auto', !formik?.values?.backup?.is_auto)
            }}
          />
          <InputShowDialog name="backup.path" formik={formik} type="folder" />
        </div>
        <div className="mt-3">
          {/* <SelectField
            isDisabled={true}
            name="chrome_version"
            formik={formik}
            placeholder={t('choose')}
            label={t('version_chrome')}
            height="38px"
            options={[
              { label: '128', value: '128' },
              { label: '130', value: '130' },
              { label: '131', value: '131' }
            ]}
          /> */}
        </div>
        <BoxItemBackupDatabase
          timeBackup={formik?.values?.backup?.backup_time}
          setIsDisable={setIsDisable}
          isDisable={isDisable}
        />
        <BoxItemRestoreDatabase
          time={formik?.values?.restore_data?.restore_time}
          setIsDisable={setIsDisable}
          isDisable={isDisable}
        />
      </div>
    </form>
  )
}

export default SettingData
