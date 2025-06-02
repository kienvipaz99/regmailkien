import {
  ButtonFlowbite,
  FormatOptionItem,
  InputField,
  SelectField,
  TextAreaField
} from '@renderer/components'
import CustomButtonSelectProxy from '@renderer/components/CustomButtonSelectProxy'
import { configFormatProxy } from '@renderer/config'
import { IPayloadCreateProxy } from '@renderer/types'
import { Modal } from 'flowbite-react'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IoIosClose } from 'react-icons/io'
import { useDebouncedValue } from 'rooks'

type TermsPopupProps = {
  isShow: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
}

const ModalAddProxy = ({ isShow, setIsShow }: TermsPopupProps): JSX.Element => {
  const idForm = useId()
  const { t } = useTranslation()

  // const validationSchemaProxy = object().shape({
  //   values: string().required(t('please_enter_proxy')),
  //   template: string().required(t('please_enter_format'))
  // })

  const modalContainerRef = useRef<HTMLDivElement>(null)

  // const { mutate: createProxy, isPending } = useCreateProxy()

  const handleClose = (): void => {
    setIsShow && setIsShow(false)
  }

  const formik = useFormik<IPayloadCreateProxy>({
    initialValues: {
      values: '',
      category: '',
      formatOptions: [],
      template: '',
      proxyType: 'static'
    },
    // validationSchema: validationSchemaProxy,
    onSubmit: () =>
      // values
      {
        // createProxy(values, {
        //   onSettled: () => {
        //     queriesToInvalidate([queryKeys.proxy.readAllProxyStatic])
        //     handleClose()
        //   }
        // })
      }
  })

  const [debounced] = useDebouncedValue(formik?.values?.values, 1000)

  const handleFormatProxy = (): void => {
    const isValue = formik?.values?.values
    const isTemplate = formik?.values?.template
    if (!isTemplate || !isValue || (isValue && !isTemplate) || (!isValue && isTemplate)) {
      return
    }
  }

  const handleSetOption = (arrTemplate: string[]): void => {
    const template = arrTemplate?.join(':')
    formik.setFieldValue('formatOptions', arrTemplate)
    formik.setFieldValue('template', template)
  }

  const handleChangeFormatOptions = (selected?: Record<string, string>): void => {
    if (selected?.value !== 'custom') {
      const arrTemplate = selected?.value?.split(', ')
      handleSetOption(arrTemplate ?? [])
    } else {
      formik.setFieldValue('template', 'custom')
    }
  }

  useEffect(() => {
    handleFormatProxy()
  }, [debounced, formik?.values?.template])

  const isCustom = formik?.values?.templateOption === 'custom'

  return (
    <>
      <Modal ref={modalContainerRef} show={isShow} onClose={handleClose} size={'4xl'}>
        <Modal.Header>{t('add_proxy')}</Modal.Header>
        <Modal.Body className="">
          <div className="text-sm text-gray-500 mb-3">
            <p className="text-red-500">- Lưu ý:</p> 1. Nếu bạn không điền loại proxy, nó sẽ mặc
            định là HTTP <br />
            2. Chỉ hỗ trợ HTTP, HTTPS, Sock 4, Sock 5 <br />
            3. Định dạng là tuỳ chọn <br />
            Ví dụ: http://192.168.1.1:3000:admin:admin <br />
            sosks://192.168.1.1:3000
            <br />
            sosks://192.168.1.1:3000:user:user 192.168.1.1:3000
            <br />
            sosks://192.168.1.1:3000
          </div>

          <form id={idForm} className="space-y-3 mb-3" onSubmit={formik.handleSubmit}>
            <TextAreaField
              formik={formik}
              name="values"
              placeholder={t('Mỗi proxy một dòng')}
              isVertical
              rows={4}
            />

            <div className="flex gap-3">
              <SelectField
                formik={formik}
                height="42px"
                name="templateOption"
                placeholder={t('select_format')}
                classWapper="w-[400px]"
                options={configFormatProxy(t)}
                changeSelected={handleChangeFormatOptions}
              />
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
                <CustomButtonSelectProxy
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

            <InputField
              name="category"
              placeholder={t('Thẻ tag')}
              classWapper="w-full"
              formik={formik}
            />
          </form>
        </Modal.Body>

        <Modal.Footer className="flex justify-center items-center gap-3 px-5 py-3">
          <ButtonFlowbite
            onClick={handleClose}
            color="failure"
            // disabled={isPending}
          >
            {t('cancel')}
          </ButtonFlowbite>

          <ButtonFlowbite
            form={idForm}
            type="submit"
            color="blue"
            // isProcessing={isPending}
            className="btn-add-account"
          >
            {t('add')}
          </ButtonFlowbite>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalAddProxy
