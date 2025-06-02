// import { ButtonFlowbite, Tabs } from '@renderer/components'
// import { configInteraction } from '@renderer/config'
// import { IOptionSelectFormat } from '@renderer/types'
// import { Modal } from 'flowbite-react'
// import { useFormik } from 'formik'
// import { isEmpty } from 'lodash'
// import { Dispatch, FC, SetStateAction, useId } from 'react'
// import { useTranslation } from 'react-i18next'
// import { toast } from 'react-toastify'

// interface ModalScriptProps {
//   isShow: boolean
//   setIsShow?: Dispatch<SetStateAction<boolean>>
//   handleGetScripts?: IOptionSelectFormat<string>[]
// }

// const ModalScript: FC<ModalScriptProps> = ({ isShow, setIsShow }) => {
//   const id = useId()
//   const { t } = useTranslation()

//   const { mutate: scriptCreate, isPending: isPendingCreate } = useCreateScript()
//   const { mutate: scriptUpdate, isPending: isPendingUpdate } = useUpdateScriptByField()
//   const isProcessing = isPendingCreate || isPendingUpdate

//   const handleClose = (): void => setIsShow && setIsShow(false)

//   const formik = useFormik<IActionScript & { id?: string }>({
//     initialValues: defaultConfigActionScript,
//     onSubmit: (values) => {
//       if (isEmpty(formik?.values?.name)) {
//         toast.error('script_name_cannot_be_empty')
//         return
//       }
//       const { id, ...newValues } = values
//       if (formik?.values?.type_script === 'add') {
//         scriptCreate(newValues)
//       } else if (id) {
//         scriptUpdate({ key: 'id', select: [id], value: newValues })
//       }
//       handleClose()
//     }
//   })

//   return (
//     <Modal show={isShow} onClose={handleClose} size={'7xl'}>
//       <Modal.Header>{t('account_interaction_configuration')}</Modal.Header>
//       <Modal.Body>
//         <form id={id} name={id} className="space-y-3" onSubmit={formik.handleSubmit}>
//           {/* <FormConfigInteraction formik={formik} handleGetScripts={handleGetScripts} /> */}
//           <Tabs tabs={configInteraction} formik={formik} />
//         </form>
//       </Modal.Body>
//       <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
//         <ButtonFlowbite isProcessing={isProcessing} type="submit" color="blue" form={id}>
//           {t('save')}
//         </ButtonFlowbite>
//         <ButtonFlowbite onClick={handleClose} color="failure">
//           {t('cancel')}
//         </ButtonFlowbite>
//       </Modal.Footer>
//     </Modal>
//   )
// }

// export default ModalScript
