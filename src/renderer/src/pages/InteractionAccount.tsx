// import { FieldsetWapper, LayoutWapper, TableInteractionAcc } from '@renderer/components'
// import ButtonActionControl from '@renderer/components/ButtonActionControl'
// import FormInteraction from '@renderer/components/Form/FormInteraction'
// import { configTableInteractionAccount } from '@renderer/config'
// import useCustomFormik from '@renderer/hook/useCustomFormik'
// import { defaultConfigInteractionAccount } from '@renderer/utils'
// import { useMemo } from 'react'

// const InteractionAcc = (): JSX.Element => {
//   const {
//     t,
//     idForm,
//     formik,
//     selectedRecords,
//     setSelectedRecords,
//     configSearch,
//     dataAccount,
//     dataHistory,
//     isFetchingData,
//     isPendingStart,
//     setConfigSearch
//   } = useCustomFormik({
//     ACTION_TYPE: 'interaction_account',
//     defaultValues: defaultConfigInteractionAccount
//   })

//   const newColumn = useMemo(() => configTableInteractionAccount({ t, dataHistory }), [dataHistory])

//   return (
//     <form id={idForm} onSubmit={formik.handleSubmit}>
//       <LayoutWapper layout="6|4">
//         <FieldsetWapper title={t('list_account')}>
//           <div className="px-2 py-5 pt-0 flex items-center justify-between">
//             <div className="gap-2 flex items-center">
//               <ButtonActionControl
//                 configSearch={configSearch}
//                 setConfigSearch={setConfigSearch}
//                 accountsList={dataAccount?.data}
//                 categoryIds={configSearch.categoryId}
//                 isPendingStart={isPendingStart}
//                 setSelectedRecords={setSelectedRecords}
//               />
//             </div>
//           </div>
//           <TableInteractionAcc
//             t={t}
//             data={dataAccount?.data}
//             selectedRows={selectedRecords}
//             onSelectedRowsChange={setSelectedRecords}
//             page={configSearch?.page}
//             pageSize={configSearch?.pageSize}
//             total={dataAccount?.total}
//             setConfigPagination={setConfigSearch}
//             columns={newColumn}
//             fetching={isFetchingData}
//           />
//         </FieldsetWapper>

//         <FieldsetWapper title={t('interactive_run_configuration')}>
//           <div className="flex flex-col gap-3">
//             <FormInteraction formik={formik} />
//           </div>
//         </FieldsetWapper>
//       </LayoutWapper>
//     </form>
//   )
// }

// export default InteractionAcc
