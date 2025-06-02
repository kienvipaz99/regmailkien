import { GMapApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'

export const useExportGMap = (): UseMutationResult<void, Error, { jobId: string }, unknown> => {
  return useMutation({
    mutationFn: async (payload: { jobId: string }) => {
      await GMapApi.exportFile({ job_id: payload.jobId })
    }
  })
}
