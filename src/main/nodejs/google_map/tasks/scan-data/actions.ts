import { DB_MAP_FILE, sendMessageToMain } from '@main/core/nodejs'
import { GMapModel } from '@main/database/models'
import { ICustomData, ITaskName } from '@main/types'
import { IOnDataMapArgs, MktMaps } from '@vitechgroup/mkt-maps'
import { IResGMapByKeyword } from '../../types'

export const scanGMapByKeyword = async (data: ICustomData<ITaskName>): Promise<boolean> => {
  try {
    const { mktBrowser, jobDetail, jobDetailData, jobId, parentPort, logUpdate } =
      data as ICustomData<'scan_g_map_by_keyword'>

    const { itemPosition, list_keyword_scan, countPositionRemain } = jobDetailData.uniqueData

    if (list_keyword_scan.length === 0) {
      return true
    }
    const onData = async (args: IOnDataMapArgs): Promise<void> => {
      let dataCreate: IResGMapByKeyword[] = []
      if (args.data?.length) {
        dataCreate = args.data.map((item) => {
          return {
            ...item,
            job_id: jobId,
            job_detail_id: jobDetail.id
          }
        })
      }
      if (dataCreate?.length) {
        console.log('🚀 ~ onData ~ dataCreate?.length:', dataCreate?.length)
        await GMapModel.create(dataCreate).catch((err) => console.error(`[Create:] ${err}`))

        sendMessageToMain(parentPort, { key: 'read_data_g_map' })
        const countData = await GMapModel.countDataByParams({ job_detail_id: jobDetail.id })
        console.log('🚀 ~ onData ~ countData:', countData)

        await logUpdate({
          action: 'scan data google map',
          mess: `scanning|${countData}|${list_keyword_scan[0]}|${args.itemPosition.brief}|${args.countPositionRemain}`
        })
      }
    }
    if (!mktBrowser) {
      return false
    }
    const mktMap = new MktMaps({ browserAction: mktBrowser.action, dbMapFile: DB_MAP_FILE })
    await mktMap.init()

    mktMap.scan.setWaitTime(60)
    mktMap.scan.setOnData(onData)

    await logUpdate({
      action: 'scan data google map',
      mess: `scanning|0|${list_keyword_scan[0]}|${itemPosition.detail}|0`
    })

    const result = await mktMap.scan.scanDataMap(
      list_keyword_scan[0],
      itemPosition,
      countPositionRemain
    )
    console.log('🚀 ~ scanGMapByKeyword ~ result:', result)

    await logUpdate({ action: 'scan data google map', mess: `finished|${list_keyword_scan[0]}` })
    return true
  } catch (error) {
    console.error('error scanGMapByKeyword', error)
    return false
  }
}
