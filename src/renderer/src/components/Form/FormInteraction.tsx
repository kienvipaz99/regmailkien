// import { ITaskTypes } from '@preload/types'
// import {
//   ButtonFlowbite,
//   CheckBoxField,
//   InputGroupCheckboxNumber,
//   ModalScript,
//   SelectField,
//   SwitchField
// } from '@renderer/components'
// import { useReadAllScript } from '@renderer/services'
// import { IPropsFormGeneric } from '@renderer/types'
// import { useMemo, useRef, useState } from 'react'
// import { useTranslation } from 'react-i18next'

// const FormInteraction = <T extends ITaskTypes['interaction_account']>({
//   formik
// }: IPropsFormGeneric<T>): JSX.Element => {
//   const { t } = useTranslation()
//   const dropdownRef = useRef<HTMLDivElement>(null)
//   const [isShowModalScript, setIsShowModalScript] = useState(false)

//   const openModalScript = (): void => setIsShowModalScript(true)
//   const { data: dataScript } = useReadAllScript()

//   const handleGetScripts = useMemo(
//     () => dataScript?.map((i) => ({ label: i.name, value: i.id })),
//     [dataScript, formik?.values.script_id]
//   )
//   return (
//     <div className="space-y-3">
//       <div className="px-2 py-5 pt-0 relative flex items-center gap-2" ref={dropdownRef}>
//         <SelectField
//           name="script_id"
//           placeholder={t('select_script')}
//           classWapper="w-[237px]"
//           options={handleGetScripts}
//           formik={formik}
//         />

//         <ButtonFlowbite
//           color="warning"
//           className="h-max bg-[#F9C047] py-[0px] border-0 whitespace-nowrap"
//           onClick={openModalScript}
//         >
//           {t('add_script')}
//         </ButtonFlowbite>
//       </div>

//       <InputGroupCheckboxNumber
//         size="md"
//         config={{
//           nameInputOne: 'errors_counter_allowed'
//         }}
//         configLabel={{
//           label: t('switch_account_error'),
//           className: 'white-space-nowrap'
//         }}
//         configTooltip={{
//           content: t('number_of_actions_false')
//         }}
//         suffix={t('interaction_acc.time')}
//         formik={formik}
//       />

//       <div className="space-y-3 mt-3">
//         <CheckBoxField
//           name="is_auto_get_info_account"
//           label={t('is_auto_get_info_account')}
//           formik={formik}
//         />

//         <SwitchField formik={formik} name="retry.is_use" label={t('repeat_action')} />
//         {formik?.values?.retry?.is_use && (
//           <div className="flex gap-3 flex-col">
//             <InputGroupCheckboxNumber
//               config={{
//                 nameInputOne: 'retry.max_retries'
//               }}
//               configLabel={{
//                 label: t('retry_interaction')
//               }}
//               suffix={t('interaction_acc.time')}
//               size="auto"
//               formik={formik}
//             />
//             <InputGroupCheckboxNumber
//               config={{
//                 nameInputOne: 'retry.wait_time'
//               }}
//               configLabel={{
//                 label: t('pause_interaction')
//               }}
//               suffix={t('interaction_acc.minute')}
//               size="auto"
//               formik={formik}
//             />
//           </div>
//         )}
//       </div>

//       {isShowModalScript && formik && (
//         <ModalScript
//           isShow={isShowModalScript}
//           setIsShow={setIsShowModalScript}
//           handleGetScripts={handleGetScripts}
//         />
//       )}
//     </div>
//   )
// }

// export default FormInteraction
