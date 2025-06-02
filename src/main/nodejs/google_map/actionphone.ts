import { ICustomData, ITaskName } from '@main/types'
import { RegGmailPhone } from './tasks'

export const executeActionPhone = async (data: ICustomData<ITaskName>): Promise<boolean> => {
  const { jobData } = data
  let result = true
  switch (jobData.actionName) {
    case 'create_gmail':
      result = await RegGmailPhone(data)
      break
    default:
      break
  }

  // console.log('🚀 ~ action ~ result:', result)
  return result
}
