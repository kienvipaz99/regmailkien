import { Text } from '@mantine/core'
import type { DefaultSettingProps } from '@renderer/types'
import { defaultScanPost } from '@renderer/utils/init'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import InputField from '../CustomFormField/InputField'
import InputGroupCheckboxNumber from '../CustomFormField/InputGroupCheckboxNumber'
import RadioField from '../CustomFormField/RadioField'
import SelectScrollCategory from '../SelectScrollCategory'

const FormScanPost = ({ formId, handleClosed, ...spread }: DefaultSettingProps): JSX.Element => {
  const { t } = useTranslation()
  const formik = useFormik({
    initialValues: defaultScanPost,
    onSubmit(values) {
      values
      handleClosed
    }
  })
  return (
    <form id={formId} onSubmit={formik.handleSubmit}>
      <div className="flex gap-5 mb-5">
        <Text className="text-sm font-medium text-gray-900 whitespace-nowrap">{t('scan_by')}</Text>
        <RadioField name="type_scan" label={t('by_link')} value={'link'} formik={formik} />
        <RadioField name="type_scan" label={t('by_keyword')} value={'keyword'} formik={formik} />
      </div>
      <InputField
        formik={formik}
        name="link_key"
        placeholder={formik.values?.type_scan === 'link' ? t('enter_link') : t('enter_keyword')}
        classWapper=" [&>div>input]:shadow-none [&>div>input]:h-full flex-1"
        className="shadow-none mb-5"
        {...spread}
      />
      <InputGroupCheckboxNumber
        formik={formik}
        config={{
          nameInputOne: 'scan_post.number'
        }}
        configLabel={{
          label: t('number_scan'),
          className: 'whitespace-nowrap'
        }}
        suffix={t('post')}
        classWapper="mb-5"
      />
      <div className="flex gap-5 mb-5">
        <Text className="text-sm font-medium text-gray-900 whitespace-nowrap">{t('scan_by')}</Text>
        <RadioField name="type_scan_post" label={t('random')} value={'random'} formik={formik} />
        <RadioField
          name="type_scan_post"
          label={t('order_by_latest')}
          value={'order'}
          formik={formik}
        />
      </div>
      <InputGroupCheckboxNumber
        formik={formik}
        config={{
          nameCheckbox: 'save_media'
        }}
        configLabel={{
          label: t('save_media')
        }}
        classWapper="mb-5"
      />
      <SelectScrollCategory
        formik={formik}
        placeholder={t('select_category')}
        type="post"
        name="categoryId"
        classWapper="mb-5"
      />
    </form>
  )
}

export default FormScanPost
