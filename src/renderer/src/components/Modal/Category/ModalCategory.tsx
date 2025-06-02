import { ButtonFlowbite, InputField } from '@renderer/components'
import { useCreateCategoryBy, useUpdateCategory } from '@renderer/services'
import type { ICategoryType, IPayloadCreateCategory } from '@renderer/types'
import { Modal } from 'flowbite-react'
import { useFormik } from 'formik'
import { Dispatch, FC, memo, SetStateAction, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { object, string } from 'yup'

interface ModalCategoryProps {
  isShow: boolean
  categoryType: ICategoryType
  setIsShow?: Dispatch<SetStateAction<boolean>>
  nameOldCategory?: string
  idCategory?: string
}

const ModalCategory: FC<ModalCategoryProps> = ({
  isShow,
  setIsShow,
  categoryType,
  nameOldCategory,
  idCategory
}) => {
  const idForm = useId()
  const { mutate: createCategory } = useCreateCategoryBy(categoryType)
  const { mutate: updateCategory } = useUpdateCategory(categoryType)
  const { t } = useTranslation()

  const validationSchema = object().shape({
    name: string().required(t('please_enter_cate'))
  })

  const handleClose = (): void => setIsShow && setIsShow(false)

  const formik = useFormik<IPayloadCreateCategory>({
    initialValues: {
      name: '',
      type: categoryType
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleClose()

      if (nameOldCategory && idCategory) {
        return updateCategory({
          id: idCategory,
          name: nameOldCategory,
          resetName: values?.name
        })
      }
      createCategory(values)
    }
  })
  return (
    <Modal show={isShow} onClose={handleClose} initialFocus={1} className="z-[9999999]">
      <Modal.Header>
        {nameOldCategory ? t('edit') : t('add')} {t('category')}
      </Modal.Header>
      <Modal.Body>
        <form id={idForm} className="space-y-3" onSubmit={formik.handleSubmit}>
          {nameOldCategory && (
            <InputField
              isVertical
              label={t('name_category_old')}
              placeholder={t('enter_cate')}
              name="oldName"
              readOnly
              disabled
              value={nameOldCategory ?? ''}
            />
          )}

          <InputField
            formik={formik}
            clsInput="name-category"
            isVertical
            label={t('name_category')}
            placeholder={t('enter_cate')}
            name="name"
            isRequired
          />
        </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
        <ButtonFlowbite onClick={handleClose} color="failure">
          {t('cancel')}
        </ButtonFlowbite>
        <ButtonFlowbite form={idForm} type="submit" color="blue" className="btn-add-category">
          {nameOldCategory ? t('update') : t('add')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default memo(ModalCategory)
