import { ICustomData, ITaskName } from '@main/types'
import { scanGMapByKeyword } from './tasks'

export const executeAction = async (data: ICustomData<ITaskName>): Promise<boolean> => {
  const { jobData } = data
  let result = true
  switch (jobData.actionName) {
    case 'scan_g_map_by_keyword':
      result = await scanGMapByKeyword(data)
      break

    default:
      break
  }

  // console.log('🚀 ~ action ~ result:', result)
  return result
}
