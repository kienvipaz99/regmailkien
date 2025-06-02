/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from '@mantine/core'
import {
  ButtonFlowbite,
  GroupTitle,
  InputField,
  ModelChatContent,
  SelectField
} from '@renderer/components'
import {
  configCreative,
  configGemini,
  configGpt,
  configLanguage,
  configSupplier,
  configTone
} from '@renderer/config/schema'
import type { DefaultSettingProps } from '@renderer/types'
import { defaultSettingSystem } from '@renderer/utils/init'

import type { ISettingSystem, IStatusCheckAi } from '@preload/types'
import { useCheckKeyAi, useReadSettingSystem, useUpdateSettingBy } from '@renderer/services'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const SettingAI = ({ formId, handleClosed, currentButton }: DefaultSettingProps): JSX.Element => {
  const { t } = useTranslation()
  const [statusKeyApi, setStatusKeyApi] = useState<IStatusCheckAi | null>(null)

  const { mutate: checkApiKey, isPending } = useCheckKeyAi()
  const { mutate: updateSettings } = useUpdateSettingBy('setting_system')
  const { data: dataSetting, isFetched } = useReadSettingSystem()

  const formik = useFormik<ISettingSystem>({
    initialValues: defaultSettingSystem,
    onSubmit(values) {
      updateSettings(
        { key: 'setting_system', value: values },
        {
          onSettled: (result) => {
            result?.status === 'success'
            currentButton === 'save_close' && handleClosed && handleClosed()
          }
        }
      )
    }
  })

  useEffect(() => {
    if (!isEmpty(dataSetting)) {
      formik && formik.setValues(dataSetting as ISettingSystem)
    }
  }, [dataSetting, isFetched])

  const handleCheckApiKey = async (): Promise<void> => {
    if (!formik?.values?.config_ai?.ai_key) {
      toast.warn(t('notifications.please_enter_key_api'))
      return
    }

    checkApiKey(
      {
        key: formik?.values?.config_ai?.ai_key ?? '',
        ai: formik?.values?.config_ai?.supplier ?? '',
        model: formik?.values?.config_ai?.model_chat ?? ''
      },
      {
        onSettled: (result) => {
          setStatusKeyApi(result?.payload?.data ?? null)
        }
      }
    )
  }

  const modelChat = formik?.values?.config_ai?.model_chat

  const handleViewText = (msg: IStatusCheckAi): JSX.Element => {
    switch (msg) {
      case 'valid_api_key':
        return (
          <p className="text-green-500 text-[14px] italic font-normal opacity-1">
            {t('ai.valid_api_key')}
          </p>
        )
      case 'key_api_limit':
      case 'server_error':
      case 'error_unknown':
      case 'invalid_api_key':
        return (
          <p className="text-warning text-[14px] italic font-normal opacity-1">
            {t('ai.invalid_api_key')}
          </p>
        )
    }
  }
  return (
    <form
      id={formId}
      onSubmit={formik?.handleSubmit}
      className="overflow-y-auto h-[65vh] custom_scroll pb-[30px]"
    >
      <GroupTitle title={t('setting.general_setting')} hr />
      <div className="px-6 my-[35px]">
        <div className="flex gap-[60px] items-center">
          <Text className="w-[250px]">{t('supplier')}</Text>
          <SelectField
            name="config_ai.supplier"
            placeholder={t('choose')}
            classWapper="w-[300px]"
            height="38px"
            options={configSupplier}
            formik={formik}
          />
          <div className=" w-[300px]">
            {(formik?.values?.config_ai?.supplier === 'gemini' ||
              formik?.values?.config_ai?.supplier === 'gpt') && (
              <Link
                to={
                  formik?.values?.config_ai?.supplier === 'gemini'
                    ? 'https://ai.google.dev'
                    : 'https://platform.openai.com/api-keys'
                }
                className="text-right flex text-blue-500 text-[14px] items-center rounded-[5px] h-[35px] justify-start"
                target="_blank"
              >
                {/* {formik?.values?.config_ai.supplier === 'gemini' ? '' : 'Link đăng ký'} */}
                <ButtonFlowbite color="blue" className="w-[90px] whitespace-nowrap">
                  {t('register')}
                </ButtonFlowbite>
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-[60px] items-center mt-[10px]">
          <Text className="w-[195px]">{t('Model Chat')}</Text>
          <SelectField
            name="config_ai.model_chat"
            placeholder={t('choose')}
            classWapper={`w-[230px] ${!formik?.values?.config_ai?.supplier ? 'pointer-events-none opacity-50' : ''}`}
            height="38px"
            options={formik?.values?.config_ai?.supplier === 'gemini' ? configGemini : configGpt}
            formik={formik}
          />
        </div>
        <div className="flex gap-[60px] items-center my-[10px] ">
          <InputField
            formik={formik}
            name="config_ai.ai_key"
            placeholder={t('API Key')}
            classWapper="flex-1 max-w-[485px]"
          />
          <ButtonFlowbite isProcessing={isPending} color="blue" onClick={handleCheckApiKey}>
            {t('check')}
          </ButtonFlowbite>
        </div>
        {statusKeyApi && handleViewText(statusKeyApi)}
        <ModelChatContent modelChat={modelChat} />
      </div>

      <GroupTitle title={t('config_render')} hr />
      <div className="px-6 my-[35px]">
        <div className="flex gap-[60px] items-center mt-[10px]">
          <Text className="w-[195px]">{t('language')}</Text>
          <SelectField
            name="config_ai.config_render.language"
            placeholder={t('choose')}
            classWapper="w-[230px]"
            height="38px"
            options={configLanguage}
            formik={formik}
          />
        </div>
        <div className="flex gap-[60px] items-center mt-[10px]">
          <Text className="w-[195px]">{t('creativity')}</Text>
          <SelectField
            name="config_ai.config_render.level_creation"
            placeholder={t('choose')}
            classWapper="w-[230px]"
            height="38px"
            options={configCreative}
            formik={formik}
          />
        </div>
        <div className="flex gap-[60px] items-center mt-[10px]">
          <Text className="w-[195px]">{t('tone')}</Text>
          <SelectField
            name="config_ai.config_render.tone"
            placeholder={t('choose')}
            classWapper="w-[230px]"
            height="38px"
            options={configTone}
            formik={formik}
          />
        </div>
      </div>
    </form>
  )
}

export default SettingAI
