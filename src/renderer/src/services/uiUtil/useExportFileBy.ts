import type { IMainResponse, IPayloadExportFile } from '@preload/types'
import { UiUtilApi } from '@renderer/apis'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useExportFileBy = (): UseMutationResult<
  IMainResponse<boolean>,
  Error,
  IPayloadExportFile,
  unknown
> => {
  return useMutation({
    mutationFn: UiUtilApi.exportFileBy,
    onSuccess: (result) => {
      if (result.status === 'success') {
        toast[result.status](result.message.key)
      }
    }
  })
}
