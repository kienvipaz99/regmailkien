import { useDebouncedValue } from '@mantine/hooks'
import type { Account } from '@preload/types'
import {
  ButtonFlowbite,
  CustomButtonSelect,
  FormatOptionItem,
  ModalCategory,
  SelectField,
  SelectScrollCategory,
  TextAreaField
} from '@renderer/components'
import ToolTips from '@renderer/components/Default/Tooltips'
import ReactTableGridCustomPaginationClient from '@renderer/components/ReactTableGridCustom/ReactTableGridCustomPaginationClient'
import { configFormatAccount, configTableAddAccount } from '@renderer/config'
import { useCreateAccount } from '@renderer/services'
import type { IPayloadCreateAccount } from '@renderer/types'
import { unZipAccount } from '@renderer/utils'
import { Modal } from 'flowbite-react'
import { useFormik } from 'formik'
import { CircleFadingPlus } from 'lucide-react'
import { Dispatch, FC, SetStateAction, useEffect, useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoIosClose } from 'react-icons/io'
import { object, string } from 'yup'

interface ModalAddAccountProps {
  isShow: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
}

const ModalAddAccount: FC<ModalAddAccountProps> = ({ isShow, setIsShow }) => {
  const idForm = useId()
  const { t } = useTranslation()
  const [isShowModal, setIsShowModal] = useState(false)
  const [nameCategory, setNameCategory] = useState<string>('')
  const [idCategory, setIdCategory] = useState<string>('')
  const validationSchemaAccount = object().shape({
    values: string().required(t('please_enter_account')),
    category: string().required(t('please_enter_category')),
    template: string().required(t('please_enter_format'))
  })
  const { mutate: createAccount, isPending } = useCreateAccount()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedRecord, setSelectedRecord] = useState((): ReadonlySet<string> => new Set())

  const handleClose = (): void => {
    if (isPending) return
    setIsShow && setIsShow(false)
  }

  const formik = useFormik<IPayloadCreateAccount>({
    initialValues: {
      values: '',
      category: '',
      formatOptions: [],
      template: ''
    },
    validationSchema: validationSchemaAccount,
    onSubmit: (values) => {
      createAccount(values, {
        onSettled: handleClose
      })
    }
  })

  const [debounced] = useDebouncedValue(formik?.values?.values, 1000)
  const columns = useMemo(() => configTableAddAccount(), [])
  const handleFormatAccounts = (): void => {
    const isValue = formik?.values?.values
    const isTemplate = formik?.values?.template
    const isCategory = formik?.values?.category
    if (
      !isCategory ||
      !isTemplate ||
      !isValue ||
      (isValue && !isTemplate) ||
      (!isValue && isTemplate)
    ) {
      accounts?.length > 0 && setAccounts([])
      return
    }

    const accountsZip = unZipAccount(isTemplate, '|', formik?.values?.values, true, isCategory)
    setAccounts(accountsZip)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeFormatOptions = (selected?: any): void => {
    let arrTemplate = []
    if (selected?.value !== 'custom') {
      arrTemplate = selected?.value?.split(', ')
    }
    handleSetOption(arrTemplate)
  }
  const handleFormCategory = (value: string, id: string): void => {
    setIsShowModal(true)
    setNameCategory(value)
    setIdCategory(id)
  }
  useEffect(() => {
    handleFormatAccounts()
  }, [formik?.values?.category, debounced, formik?.values?.template])

  const isCustom = formik?.values?.templateOption === 'custom'

  const handleSetOption = (arrTemplate: string[]): void => {
    const template = arrTemplate?.join('|')
    formik.setFieldValue('formatOptions', arrTemplate)
    formik.setFieldValue('template', template)
  }

  return (
    <>
      <Modal show={isShow} onClose={handleClose} size={'6xl'}>
        <Modal.Header>{t('add_account')}</Modal.Header>
        <Modal.Body>
          <form id={idForm} className="space-y-3 mb-3" onSubmit={formik.handleSubmit}>
            <TextAreaField
              formik={formik}
              name="values"
              placeholder={t('input_account')}
              isVertical
              rows={4}
            />
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <SelectScrollCategory formik={formik} classWapper="w-[200px]" />
                <ToolTips content={t('add_category')}>
                  <ButtonFlowbite
                    color="blue"
                    size="sm"
                    className="add-category"
                    StartIcon={CircleFadingPlus}
                    onClick={() => handleFormCategory('', '')}
                  >
                    {t('add')}
                  </ButtonFlowbite>
                </ToolTips>
              </div>
              <SelectField
                formik={formik}
                height="42px"
                name="templateOption"
                placeholder={t('select_format')}
                classWapper="w-[400px]"
                options={configFormatAccount}
                changeSelected={handleChangeFormatOptions}
              />
              <ButtonFlowbite
                color="warning"
                className="h-max border-0"
                onClick={() => formik.resetForm()}
              >
                {t('reload')}
              </ButtonFlowbite>
            </div>
            <div className="items flex w-auto gap-3 flex-wrap">
              {(formik?.values?.formatOptions ?? [])?.map((item: string, index: number) => (
                <FormatOptionItem key={index} className="min-w-[50px]" classWapper="relative">
                  {item}

                  {isCustom && (
                    <div
                      className="-top-1 -right-1 absolute bg-gray-100 shadow-sm text-gray-500 transition-all duration-75 rounded-full"
                      onClick={() => {
                        const newOption = [...(formik?.values?.formatOptions ?? [])]
                        newOption.splice(index, 1)
                        handleSetOption(newOption)
                      }}
                    >
                      <IoIosClose size={15} />
                    </div>
                  )}
                </FormatOptionItem>
              ))}
              {isCustom && (
                <CustomButtonSelect
                  values={formik?.values?.formatOptions}
                  onChange={(value) => {
                    if (value) {
                      const newOption = [...(formik?.values?.formatOptions ?? []), value]
                      handleSetOption(newOption)
                    }
                  }}
                />
              )}
            </div>
          </form>
          <div className="table-addAccount">
            <ReactTableGridCustomPaginationClient
              columns={columns}
              data={accounts}
              rowKeyGetter="uid"
              selectedRows={selectedRecord}
              onSelectedRowsChange={setSelectedRecord}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
          <ButtonFlowbite onClick={handleClose} color="failure" disabled={isPending}>
            {t('cancel')}
          </ButtonFlowbite>
          <ButtonFlowbite form={idForm} type="submit" color="blue" isProcessing={isPending}>
            {t('add')}
          </ButtonFlowbite>
        </Modal.Footer>
      </Modal>
      {isShowModal && (
        <ModalCategory
          isShow={isShowModal}
          setIsShow={setIsShowModal}
          categoryType={'account'}
          nameOldCategory={nameCategory}
          idCategory={idCategory}
        />
      )}
    </>
  )
}

export default ModalAddAccount
