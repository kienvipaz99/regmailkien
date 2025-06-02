// import { parseObject } from '@renderer/helper'
// import { IDataJob, IListJob, ValuesJob } from '@renderer/types'
// import { has, omit } from 'lodash'
// import {
//   createContext,
//   FC,
//   PropsWithChildren,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState
// } from 'react'
// import { useLocation } from 'react-router-dom'

// const JobContext = createContext<ValuesJob>({
//   handleSaveJob: () => {},
//   listJob: {},
//   handleRemoveJob: () => {},
//   handleChangeWork: () => {},
//   handleStopAction: () => {}
// })

// const nameJobId = 'jobs'

// const LayoutJobProvider: FC<PropsWithChildren> = ({ children }): JSX.Element => {
//   const [currentJob, setCurrentJob] = useState<IDataJob | undefined>()
//   const [listJob, setListJob] = useState<IListJob>(() => {
//     const currentJob = sessionStorage.getItem(nameJobId)
//     return parseObject(currentJob ?? '') as IListJob
//   })
//   const location = useLocation()

//   useEffect(() => {
//     const pathName = location?.pathname
//     if (has(listJob, pathName)) {
//       const jobId = listJob[pathName]
//       setCurrentJob(jobId)
//     }
//   }, [location?.pathname])

//   const handleSave = useCallback((newJob: IListJob) => {
//     sessionStorage.setItem(nameJobId, JSON.stringify(newJob))
//     setListJob(newJob)
//   }, [])

//   const handleSaveJob = useCallback(
//     (jobId: string) => {
//       const currentObj: IDataJob = { jobId, isWork: true }
//       const pathName = location?.pathname
//       const newListJob = { ...listJob, [pathName]: currentObj }
//       handleSave(newListJob)
//       setCurrentJob(currentObj)
//     },
//     [location?.pathname, listJob, handleSave]
//   )

//   const handleChangeWork = useCallback(
//     (isWork?: boolean) => {
//       const pathName = location?.pathname
//       if (has(listJob, pathName)) {
//         const currentObj = { ...(listJob[pathName] ?? {}), isWork: !!isWork }
//         const newListJob = { ...listJob, [pathName]: currentObj }
//         handleSave(newListJob)
//         setCurrentJob(currentObj)
//       }
//     },
//     [location?.pathname, listJob, handleSave]
//   )

//   const handleStopAction = useCallback(() => {
//     const updatedJobIds = Object.keys(listJob).reduce((acc, key) => {
//       acc[key] = { ...listJob[key], isWork: false }
//       return acc
//     }, {})

//     handleSave(updatedJobIds)
//     setCurrentJob(undefined)
//   }, [listJob, handleSave])

//   const handleRemoveJob = useCallback(() => {
//     const pathName = location?.pathname
//     const newJobId = omit(listJob, pathName)
//     handleSave(newJobId)
//     setCurrentJob(undefined)
//   }, [location?.pathname, listJob, handleSave])

//   const values = useMemo((): ValuesJob => {
//     return {
//       jobId: currentJob?.jobId,
//       isWork: currentJob?.isWork,
//       handleSaveJob,
//       listJob,
//       handleRemoveJob,
//       handleChangeWork,
//       handleStopAction
//     }
//   }, [currentJob, handleSaveJob, listJob, handleRemoveJob, handleChangeWork])

//   return <JobContext.Provider value={values}>{children}</JobContext.Provider>
// }

// export const useGetJobId = (): ValuesJob => useContext(JobContext)

// export default LayoutJobProvider
