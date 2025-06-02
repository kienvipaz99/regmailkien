// import { AuthApi } from '@renderer/apis'
// import { useQuery, UseQueryResult } from '@tanstack/react-query'
// import { queryKeys } from '../queryKeys'

// export const useGetHis = (): UseQueryResult<string, Error> => {
//   return useQuery({
//     queryKey: [queryKeys.auth.his],
//     queryFn: async () => {
//       const result = await AuthApi.getHis()
//       if (result.status === 'error') {
//         return
//       }
//       return result.payload?.data
//     }
//   })
// }
