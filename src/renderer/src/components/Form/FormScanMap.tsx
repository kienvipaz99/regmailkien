/* eslint-disable no-unsafe-optional-chaining */
import { ITaskTypes } from '@preload/types'
import { useButtonStateProvider } from '@renderer/context'
import useCustomFormik from '@renderer/hook/useCustomFormik'
import { useStartAction } from '@renderer/services'
import { CirclePlay, CircleX } from 'lucide-react'
import { useState } from 'react'
import BoxItemForm from '../BoxItemForm'
import ButtonForm from '../ButtonAction/Default/ButtonForm'
import { InputField, InputGroupCheckboxNumber, RadioField, SwitchField } from '../CustomFormField'
import { ButtonFlowbite } from '../Default'
import { ModalText } from '../Modal'

const FormScanMap = (): JSX.Element => {
  const { idForm, formik, t, isPendingStart } = useCustomFormik<ITaskTypes['create_gmail']>({
    ACTION_TYPE: 'create_gmail',
    defaultValues: {
      creation_method: 'browser', // 'browser' or 'phone'
      default_password: '',
      use_random_password: false,
      first_name_path: '',
      last_name_path: '',
      interval: { from: 1, to: 3 },
      number_of_accounts: 1
    }
  })

  const { mutate: startAction } = useStartAction()
  const { isPendingCheck, isPendingStop, isWork } = useButtonStateProvider()
  const isProcessing = isPendingStop || isPendingStart

  const openModal = (key: keyof typeof modals): void => {
    setModals((prev) => ({ ...prev, [key]: { ...modals[key], open: true } }))
  }

  const [modals, setModals] = useState({
    listFirstNamePath: {
      open: false,
      title: t('Nhập danh sách tên'),
      name: 'first_name_path'
    },
    listLastNamePath: {
      open: false,
      title: t('Nhập danh sách họ'),
      name: 'last_name_path'
    }
  })

  return (
    <form id={idForm} onSubmit={formik.handleSubmit}>
      <div className="space-y-5">
        <ButtonFlowbite
          form={idForm}
          type={isWork ? 'button' : 'submit'}
          StartIcon={isWork ? CircleX : CirclePlay}
          color={isWork ? 'failure' : 'success'}
          className={isWork ? 'my-auto' : 'btn-start h-fit flex'}
          size="sm"
          onClick={() => isWork && startAction({ actionName: 'stop_job', data: [] })}
          disabled={isProcessing || isPendingCheck}
          isProcessing={isProcessing}
        >
          {t(isWork ? 'stop' : 'start')}
        </ButtonFlowbite>

        <BoxItemForm title={t('config_general')} className="space-y-3">
          <InputGroupCheckboxNumber
            config={{
              nameInputOne: 'interval.from',
              nameInputTwo: 'interval.to'
            }}
            configLabel={{
              label: t('Thời gian chờ giữa các hành động')
            }}
            suffix={t('second')}
            numberSize={200}
            formik={formik}
            configLabelTwo={{ label: t('to') }}
          />
          {/* <SwitchField formik={formik} name="show_browser" label={t('show_browser')} /> */}
        </BoxItemForm>

        <BoxItemForm title={t('Cấu hình')} className="space-y-4">
          <div className="flex gap-5">
            <RadioField
              name="creation_method"
              label={t('browser')}
              formik={formik}
              value={'browser'}
            />
            <RadioField name="creation_method" label={t('phone')} formik={formik} value={'phone'} />
          </div>

          <div className="space-y-4">
            <SwitchField
              formik={formik}
              name="use_random_password"
              label={t('use_random_password')}
            />

            {!formik.values.use_random_password && (
              <InputField
                name="default_password"
                label={t('default_password')}
                type="text"
                formik={formik}
                placeholder={t('enter_default_password')}
                isVertical
              />
            )}

            <InputField
              name="number_of_accounts"
              label={t('Số lượng tài khoản')}
              type="number"
              formik={formik}
              placeholder={t('Nhập số lượng tài khoản muốn tạo')}
              isVertical
              min={1}
            />

            <div className="grid grid-cols-2 gap-4">
              <ButtonForm
                openModal={openModal}
                value={formik?.values?.first_name_path}
                modalKey="listFirstNamePath"
                buttonText="Nhập"
                selectedText="selected_first_name_path"
              />
              <ButtonForm
                openModal={openModal}
                value={formik?.values?.last_name_path}
                modalKey="listLastNamePath"
                buttonText="Nhập"
                selectedText="selected_last_name_path"
              />
            </div>
          </div>
        </BoxItemForm>
      </div>

      <div className="space-y-3 mt-3">
        {Object.keys(modals).map(
          (key) =>
            modals[key] && (
              <ModalText
                key={key}
                isShow={modals[key].open}
                setIsShow={(isShow) =>
                  setModals((prev) => ({
                    ...prev,
                    [key]: { ...modals[key], open: isShow }
                  }))
                }
                name={modals[key].name}
                titleModal={modals[key].title}
                formik={formik}
                placeholder={t('one_path_per_line')}
              />
            )
        )}
      </div>
    </form>
  )
}

export default FormScanMap
