import type { IMainResponse } from '@preload/types'
import { ButtonFlowbite, SelectScrollCategory } from '@renderer/components'
import {
  useReadCategoryByField,
  useUpdateAccountByField,
  useUpdatePostByField
} from '@renderer/services'
import { Modal } from 'flowbite-react'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { Dispatch, FC, SetStateAction, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
interface ModalChangeCategoryProps {
  isShow: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
  type?: 'account' | 'post'
  setSelectedRecords?: Dispatch<SetStateAction<ReadonlySet<string>>>
  listUid: string[]
}

const ModalChangeCategory: FC<ModalChangeCategoryProps> = ({
  isShow,
  setIsShow,
  listUid,
  type = 'account',
  setSelectedRecords
}): JSX.Element => {
  const idForm = useId()
  const { t } = useTranslation()
  const { mutate: readCategoryByField, isPending } = useReadCategoryByField()
  const { mutate: updateAccountByField, isPending: isPendingAccount } = useUpdateAccountByField()
  const { mutate: updatePostByField, isPending: isPendingPost } = useUpdatePostByField()
  const isProcessing = isPending || isPendingAccount || isPendingPost

  const handleClose = (): void => setIsShow && setIsShow(false)

  const onSettledUpdate = (result: IMainResponse<boolean> | undefined): void => {
    if (result?.status === 'success') {
      setSelectedRecords && setSelectedRecords(new Set())
      handleClose()
    }
  }

  const formik = useFormik({
    initialValues: { category: '' },
    onSubmit: (values) => {
      if (isEmpty(values.category)) {
        toast.warn(t('please_choose_category'))
        return
      }

      readCategoryByField([{ key: 'id', select: values.category }], {
        onSettled: (response) => {
          const category = response?.payload?.data?.[0]
          if (!category) {
            toast.error(t('no_category_selected'))
            return
          }
          if (type === 'account') {
            updateAccountByField(
              { key: 'uid', value: { category }, select: listUid },
              { onSettled: onSettledUpdate }
            )
          } else if (type === 'post') {
            updatePostByField(
              { key: 'uuid', value: { category }, select: listUid },
              { onSettled: onSettledUpdate }
            )
          }
        }
      })
    }
  })

  return (
    <Modal
      show={isShow}
      onClose={() => setIsShow && setIsShow(false)}
      size="lg"
      className="modal-copy"
    >
      <form className="mb-3 modal-copy-form" id={idForm} onSubmit={formik.handleSubmit}>
        <Modal.Header className="px-5 py-3">{t('choose_category')}</Modal.Header>
        <Modal.Body>
          <div className="flex gap-3 flex-col justify-start">
            <SelectScrollCategory formik={formik} type={type} classWapper="w-[100%]" />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
          <ButtonFlowbite isProcessing={isProcessing} form={idForm} type="submit" color="blue">
            {t('confirm')}
          </ButtonFlowbite>

          <ButtonFlowbite type="button" onClick={handleClose} className="bg-red-500">
            {t('cancel')}
          </ButtonFlowbite>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default ModalChangeCategory
