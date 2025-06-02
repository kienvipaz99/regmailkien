import { FileButton, Text } from '@mantine/core'
import type { IInfoFile } from '@preload/types'
import BoxItemForm from '@renderer/components/BoxItemForm'
import InputField from '@renderer/components/CustomFormField/InputField'
import InputGroupCheckboxNumber from '@renderer/components/CustomFormField/InputGroupCheckboxNumber'
import SelectField from '@renderer/components/CustomFormField/SelectField'
import TextAreaField from '@renderer/components/CustomFormField/TextAreaField'
import ButtonFlowbite from '@renderer/components/Default/ButtonFlowbite'
import SelectScrollCategory from '@renderer/components/SelectScrollCategory'
import TextSpanBox from '@renderer/components/TextSpanBox'
import { optionsTypeContent } from '@renderer/config/configContent'
import { cn } from '@renderer/helper'
import {
  useCreatePostBy,
  useGetInfoFile,
  useReadPostByField,
  useShowDialog,
  useUpdatePostByField
} from '@renderer/services'
import type { IModalAddPost, IPayloadCreateUpdatePost } from '@renderer/types'
import { Modal } from 'flowbite-react'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { FC, useEffect, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalConfirm } from '../Default'

interface IListVariable {
  key: string
  value: string
}

const ModalContentManagement: FC<IModalAddPost> = ({ isShow, setIsShow, listUid }) => {
  const { t } = useTranslation()
  const idForm = useId()

  const [selectedFiles, setSelectedFiles] = useState<IInfoFile[]>([])
  const [tab] = useState('status')
  const isImages = tab === 'media'

  const { mutate: createPost, isPending: isPendingCreate } = useCreatePostBy()
  const { mutate: showDialog } = useShowDialog()
  const { mutateAsync: mutateAsyncGetInfoFile } = useGetInfoFile()
  const { mutate: updatePost, isPending: isPendingUpdate } = useUpdatePostByField()
  const { data: dataPost } = useReadPostByField([{ key: 'uuid', select: listUid ?? [] }])

  const isProcessing = isPendingCreate || isPendingUpdate
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const handleClose = (): void => setIsShow && setIsShow(false)

  const listVariable: IListVariable[] = [
    { key: '$number', value: t('random_number') },
    { key: '$date', value: t('current_date') },
    { key: '$timespan', value: t('current_timespan') },
    { key: '$text', value: t('random_text') },
    { key: '$time', value: t('current_time') },
    { key: '$smile', value: t('random_icon') }
  ]

  const formik = useFormik<IPayloadCreateUpdatePost>({
    initialValues: {
      categoryId: '',
      type_post: 'post',
      post_type: 'random',
      title: '',
      quantity_attached: 1,
      content: '',
      attached: ''
    },
    onSubmit: (values) => {
      values.attached = selectedFiles.map((file) => file.path).join('\n')
      if (isEmpty(dataPost)) {
        createPost(values)
      } else {
        updatePost({ key: 'uuid', value: values, select: listUid ?? [] })
      }
      handleClose()
    }
  })

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const resultPost = dataPost?.[0]
      if (!resultPost) {
        return
      }

      formik.setValues({ ...resultPost, categoryId: resultPost.category?.id ?? '' })

      const attachedFiles = resultPost.attached?.split('\n').filter(Boolean) || []
      const imagesPromises = attachedFiles.map(async (path) => {
        try {
          const response = await mutateAsyncGetInfoFile(path)
          return {
            path,
            size: response?.payload?.data?.size ?? 0,
            name: response?.payload?.data?.name ?? '-',
            base64: response?.payload?.data?.base64 ?? '-'
          }
        } catch {
          return { path, size: 0, name: '-', base64: '-' }
        }
      })

      const images = await Promise.all(imagesPromises)
      setSelectedFiles(images)
    }

    fetchData()
  }, [dataPost])

  const handleDeleteAllFiles = (): void => {
    setSelectedFiles([])
    setShowConfirmDelete(false)
  }

  const confirmDelete = (): void => {
    setShowConfirmDelete(true)
  }

  const cancelDelete = (): void => {
    setShowConfirmDelete(false)
  }

  const handleDeleteFile = (fileToDelete: IInfoFile): void => {
    const updatedFiles = selectedFiles.filter((file) => file.path !== fileToDelete.path)
    setSelectedFiles(updatedFiles)
  }

  return (
    <Modal show={isShow} onClose={handleClose} size={'4xl'}>
      <Modal.Header>{t('input_and_edit_post')}</Modal.Header>
      <Modal.Body>
        <form id={idForm} onSubmit={formik.handleSubmit}>
          <SelectScrollCategory
            formik={formik}
            placeholder={t('select_category')}
            type="post"
            name="categoryId"
            classWapper="mb-5"
          />

          <SelectField
            name="type_post"
            label="Loại"
            classWapper="mb-5"
            placeholder={t('select_type')}
            formik={formik}
            options={optionsTypeContent}
            isVertical
            isRequired
          />

          <BoxItemForm className="space-y-4">
            <InputField
              name="title"
              placeholder={t('input_title_post')}
              label={t('title_post')}
              isVertical
              isRequired
              formik={formik}
            />

            <div className={cn('flex gap-8', isImages ? '[&>*]:w-1/2' : '[&>*]:w-full')}>
              <TextAreaField
                name="content"
                placeholder={t('input_content')}
                label={t('content')}
                isVertical
                isRequired
                rows={5}
                classWapper={cn(isImages && '[&>span]:mb-[22px]')}
                formik={formik}
              />
            </div>

            <div className="flex items-center">
              <div className="w-3/5">
                <Text className="text-[13px] text-red-500">{t('note')}</Text>

                <TextSpanBox color="blue" className="text-xs my-2">
                  - {t('structure_spin_content')}
                </TextSpanBox>

                <TextSpanBox color="blue" className="text-xs">
                  - {t('valid_characters')}
                </TextSpanBox>

                <div className="mt-2 flex flex-wrap [&>*]:w-[calc(50%_-_8px)] gap-2">
                  {listVariable?.map((item, index) => {
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <TextSpanBox color="blue" className="text-xs whitespace-nowrap w-12">
                          {item?.key}
                        </TextSpanBox>

                        <TextSpanBox color="blue" className="text-xs">
                          : {item?.value}
                        </TextSpanBox>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-4 flex gap-4">
                {selectedFiles.map((file, index) => {
                  return (
                    <div
                      key={index}
                      className="cursor-pointer cls"
                      onClick={() => handleDeleteFile(file)}
                    >
                      <img
                        src={`data:image/jpg;base64,${file.base64}`}
                        alt={file.name}
                        className="w-16 h-16 object-cover border border-gray-300 rounded"
                      />
                    </div>
                  )
                })}
              </div>
            )}
            {['post', 'comment', 'message'].includes(formik?.values?.type_post ?? '') && (
              <>
                <Text>{t('select_media')}</Text>
                <Text className="text-[13px] text-red-500 italic opacity-[0.5] !mt-[0.5]">
                  {t('note_upload')}
                </Text>

                <div className="flex items-center justify-start gap-5">
                  <div className="flex items-center">
                    <FileButton onChange={() => {}}>
                      {() => (
                        <div>
                          <div className="flex items-center gap-5">
                            <ButtonFlowbite className="bg-[#dc2626]" onClick={confirmDelete}>
                              {t('clear_all')}
                            </ButtonFlowbite>
                            <ButtonFlowbite
                              color="blue"
                              onClick={() => {
                                showDialog(
                                  {
                                    type: 'image_and_video',
                                    isMulti: true,
                                    maxImage: 10,
                                    maxVideo: 5
                                  },
                                  {
                                    onSettled: async (result) => {
                                      if (Array.isArray(result?.payload?.data)) {
                                        const files = await Promise.all(
                                          result?.payload?.data?.map(async (path) => {
                                            const result = await mutateAsyncGetInfoFile(path)
                                            return {
                                              path: path ?? '-',
                                              base64: result.payload?.data?.base64 ?? '-',
                                              size: result?.payload?.data?.size ?? 0,
                                              name: result?.payload?.data?.name ?? '-'
                                            }
                                          })
                                        )
                                        setSelectedFiles(files)
                                      }
                                    }
                                  }
                                )
                              }}
                            >
                              {t('upload_media')}
                            </ButtonFlowbite>
                          </div>
                          <TextSpanBox color="blue" className="text-md whitespace-nowrap ml-2">
                            {t('total')}: {selectedFiles?.length ?? 0}
                          </TextSpanBox>

                          {formik?.values?.type_post !== 'comment' && (
                            <InputGroupCheckboxNumber
                              formik={formik}
                              config={{
                                nameInputOne: 'quantity_attached'
                              }}
                              configLabel={{
                                label: t('maximum_postings')
                              }}
                              suffix={t('image')}
                            />
                          )}

                          <div className="flex gap-5">
                            <Text>{t('posted_by')}</Text>

                            <InputGroupCheckboxNumber
                              formik={formik}
                              config={{
                                nameRadio: 'post_type',
                                radioProps: {
                                  value: 'in_turn',
                                  checked: formik?.values?.post_type === 'in_turn',
                                  onChange: () => {
                                    formik.setFieldValue('post_type', 'in_turn')
                                  }
                                }
                              }}
                              configLabel={{
                                label: t('order')
                              }}
                            />

                            <InputGroupCheckboxNumber
                              formik={formik}
                              config={{
                                nameRadio: 'post_type',
                                radioProps: {
                                  value: 'random',
                                  checked: formik?.values?.post_type === 'random',
                                  onChange: () => {
                                    formik.setFieldValue('post_type', 'random')
                                  }
                                }
                              }}
                              configLabel={{
                                label: t('random')
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </FileButton>
                  </div>
                </div>

                <div></div>
              </>
            )}
          </BoxItemForm>
          <ModalConfirm
            isShow={showConfirmDelete}
            setIsShow={setShowConfirmDelete}
            title={t('confirm_delete')}
            onCancel={cancelDelete}
            onChange={() => handleDeleteAllFiles()}
            isProcessing={false}
          />
        </form>
      </Modal.Body>

      <Modal.Footer className="flex items-center justify-center">
        <ButtonFlowbite isProcessing={isProcessing} form={idForm} type="submit" color="success">
          {t('save')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalContentManagement
