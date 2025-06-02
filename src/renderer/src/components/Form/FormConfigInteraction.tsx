// import { IActionScript } from '@preload/types'
// import {
//   ButtonFlowbite,
//   InputField,
//   InputGroupCheckboxNumber,
//   RadioField,
//   SelectField,
//   SwitchField
// } from '@renderer/components'
// import { useReadAllScriptByField, useRemoveScriptByField } from '@renderer/services'
// import { IPropsFormGeneric } from '@renderer/types'
// import { useEffect } from 'react'
// import { useTranslation } from 'react-i18next'

// const FormConfigInteraction = ({
//   formik,
//   handleGetScripts
// }: IPropsFormGeneric<IActionScript & { id?: string }>): JSX.Element => {
//   const { t } = useTranslation()
//   const idScript = formik?.getFieldProps<string>('id')?.value

//   const { mutate: readScriptByField } = useReadAllScriptByField()
//   const { mutate: deleteScript } = useRemoveScriptByField()

//   const updateNestedFields = (scripts: IActionScript, checked: boolean): void => {
//     Object.keys(scripts).forEach((key) => {
//       if (scripts[key] && typeof scripts[key] === 'object') {
//         if ('is_use' in scripts[key]) {
//           scripts[key].is_use = checked
//         }
//         updateNestedFields(scripts[key], checked)
//       }
//     })
//   }

//   const handleGetScript = async (): Promise<void> => {
//     if (!idScript || !formik) {
//       return
//     }
//     readScriptByField([{ key: 'id', select: [idScript ?? ''] }], {
//       onSettled: (response) => {
//         const result = response?.payload?.data?.[0]
//         if (result) {
//           formik.setValues({ ...result, id: result.id, type_script: 'update' })
//         }
//       }
//     })
//   }

//   const handleDeleteScript = async (): Promise<void> => {
//     if (!idScript) {
//       return
//     }
//     deleteScript({ key: 'id', select: [idScript] })
//   }

//   const handleCheckAll = async (): Promise<void> => {
//     if (!formik) {
//       return
//     }
//     const checked = formik.getFieldProps<boolean>('is_choose_all').value
//     const newValues: IActionScript = { ...formik?.values }
//     updateNestedFields(newValues, checked)
//     if (newValues) formik.setValues(newValues)
//   }

//   useEffect(() => {
//     handleGetScript()
//   }, [idScript])

//   useEffect(() => {
//     handleCheckAll()
//   }, [formik?.values['is_choose_all']])

//   return (
//     <>
//       <div className="flex items-center gap-3">
//         <div className="2xl:w-[15%] w-[175px]">
//           <RadioField name="type_script" label={t('add_script')} value={'add'} formik={formik} />
//         </div>

//         <InputField
//           name="name"
//           placeholder={t('name_script')}
//           classWapper="w-[395px]"
//           formik={formik}
//         />

//         <InputGroupCheckboxNumber
//           config={{
//             nameInputOne: 'total_action'
//           }}
//           configLabel={{
//             label: t('total_action')
//           }}
//           suffix={t('action')}
//           numberSize={200}
//           formik={formik}
//         />
//       </div>

//       <div className="flex items-center gap-3 mt-3">
//         <div className="2xl:w-[15%] w-[175px]">
//           <RadioField
//             name="type_script"
//             label={t('edit_current_script')}
//             value={'update'}
//             formik={formik}
//           />
//         </div>

//         <SelectField
//           name="id"
//           placeholder={t('select_script')}
//           classWapper="w-[237px]"
//           formik={formik}
//           options={handleGetScripts}
//         />

//         <ButtonFlowbite
//           color="failure"
//           onClick={handleDeleteScript}
//           className="whitespace-nowrap w-[145px]"
//         >
//           {t('delete_script')}
//         </ButtonFlowbite>

//         <InputGroupCheckboxNumber
//           config={{
//             nameInputOne: 'interval.from',
//             nameInputTwo: 'interval.to'
//           }}
//           configLabel={{
//             label: t('delay')
//           }}
//           suffix={t('second')}
//           numberSize={200}
//           formik={formik}
//         />
//       </div>
//       <div className="space-y-2 mt-3 flex flex-col gap-4">
//         <SwitchField formik={formik} name="is_use_ai" label={t('auto_render_ai')} />
//         <SwitchField formik={formik} name="is_duplicate" label={t('no_duplicate')} />
//         <SwitchField formik={formik} name="is_choose_all" label={t('check/uncheck_all')} />
//       </div>
//     </>
//   )
// }

// export default FormConfigInteraction
