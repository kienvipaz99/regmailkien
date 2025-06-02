import { logger } from '@main/core/nodejs'
import { settings } from '@main/helper'
import type {
  IJobData,
  IJobWorkerData,
  IPayloadStartAction,
  ITaskName,
  ITaskTypes
} from '@preload/types'
import { MktJobDb } from '@vitechgroup/mkt-job-queue'
import { chain, trim } from 'lodash'
import { readAllSetting } from './utils'

export function createProfilesByThreads(countThreads: number): string[] {
  const arrProfiles: string[] = []
  for (let i = 0; i < countThreads; i++) {
    arrProfiles.push(`profile_${i}`)
  }

  return arrProfiles
}

export const createJob = async (
  mktJobDb: MktJobDb,
  { actionName }: IPayloadStartAction
): Promise<IJobWorkerData | undefined> => {
  try {
    const result = readAllSetting()
    const config = settings.get(actionName)
    const listUniqueData = prepareUniqueData(actionName, config)
    const jobData: IJobData<ITaskName> = { ...result, config, actionName }
    const job = await mktJobDb.jobRepo.save({ data: JSON.stringify(jobData) })
    console.log(listUniqueData, 'listUniqueData')

    const jobDetailData = listUniqueData.map((uniqueData, index) => ({
      job,
      data: JSON.stringify({
        uidAccount: `profile_${Math.random().toString(36).substring(2, 15)}`,
        uniqueData: {
          list_keyword_scan: [uniqueData],
          countPositionRemain: listUniqueData.length - (index + 1),
          creation_method: (config as ITaskTypes['create_gmail']).creation_method
        }
      })
    }))

    await mktJobDb.jobDetailRepo.save(jobDetailData)

    return { jobId: job.id, threadRun: result.setting_system.threads_run }
  } catch (error) {
    logger.error(`Create job error ${error}`)
    return
  }
}

const parseLines = (data: string): string[] => {
  return chain(data).split(/\r?\n/).map(trim).filter(Boolean).value()
}

const prepareUniqueData = (actionName: ITaskName, payload: ITaskTypes[ITaskName]): string[] => {
  let result: string[] = []

  switch (actionName) {
    case 'scan_g_map_by_keyword': {
      const scanPayload = payload as ITaskTypes['scan_g_map_by_keyword']
      result = parseLines(scanPayload.keyword)
      break
    }
    case 'create_gmail': {
      const gmailPayload = payload as ITaskTypes['create_gmail']
      const count = gmailPayload.number_of_accounts
      result = Array.from({ length: count }, (_, i) => `gmail_${i + 1}`)
      break
    }
    default: {
      break
    }
  }

  return result
}
