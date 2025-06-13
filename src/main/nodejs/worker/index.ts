import { CheckBrowser, DB_JOB_FILE, DB_PROXY_FILE, logger } from '@main/core/nodejs'
import {
  AppDataHistorySource,
  AppDataScanSource,
  AppDataSource
} from '@main/database/AppDataSource'
import { MktJobQueue } from '@vitechgroup/mkt-job-queue'
import { MktProxyManager } from '@vitechgroup/mkt-proxy-client'
import { parentPort, workerData } from 'node:worker_threads'
import { ExportExcelManager } from './export-data'
import { ProfileBackupManager } from './profile-backup-manager'
import { RecoveryManager } from './recovery-manager'
import { StartAction } from './start-action'

AppDataSource.initialize()
  .then(async () => {
    await AppDataScanSource.initialize()
    await AppDataHistorySource.initialize()

    if (!parentPort) {
      throw new Error('No parent port')
    }

    const { type, data } = workerData

    switch (type) {
      case 'recovery_data': {
        return new RecoveryManager(data, parentPort).synchronize()
      }

      case 'backup_profile': {
        return new ProfileBackupManager(data, parentPort).startBackup()
      }

      case 'check_browser': {
        return new CheckBrowser(data, parentPort).startCheck()
      }

      case 'export_excel': {
        return new ExportExcelManager(
          data.typeExport,
          data.filePath,
          data.jobId,
          parentPort
        ).exportData()
      }

      default: {
        const mktJobQueue = new MktJobQueue(DB_JOB_FILE, data.threadRun, false).setJobId(data.jobId)
        await mktJobQueue.open()
        const mktProxyManager = MktProxyManager.getInstance(DB_PROXY_FILE)
        await (
          await mktProxyManager.connectDb()
        ).dataSource
        return await new StartAction(data, mktJobQueue, parentPort).start()
      }
    }
  })
  .catch((err) => {
    logger.error('Failed to initialize AppDataSource:', err)
    process.exit(1)
  })
