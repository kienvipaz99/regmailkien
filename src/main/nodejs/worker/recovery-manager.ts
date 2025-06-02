import { logger, sendMessageToMain } from '@main/core/nodejs'
import { AppDataSource } from '@main/database/AppDataSource'
import { IRecoveryWorkerData } from '@main/types'
import { MessagePort } from 'node:worker_threads'
import { DataSource, QueryRunner } from 'typeorm'

export class RecoveryManager {
  private parentPort: MessagePort
  private queryRunner: QueryRunner | null = null
  private lastSentPercentage: number = 0
  private currentDatabase: DataSource

  constructor(workerData: IRecoveryWorkerData, parentPort: MessagePort) {
    this.parentPort = parentPort
    this.currentDatabase = new DataSource({
      type: 'better-sqlite3',
      database: workerData.path
    })
  }

  private sendProgress(percentage: number): void {
    if (percentage > this.lastSentPercentage) {
      sendMessageToMain(this.parentPort, { key: 'recovery_progress', data: percentage.toFixed(2) })
      this.lastSentPercentage = percentage
    } else if (percentage >= 100) {
      sendMessageToMain(this.parentPort, { key: 'recovery_finally' })
    }
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await this.currentDatabase.initialize()
      this.queryRunner = AppDataSource.createQueryRunner()
      await this.queryRunner.connect()
      await this.queryRunner.startTransaction()
    } catch (error) {
      logger.error(`[Database Initialization Error] ${error}`)
      throw new Error('Failed to initialize database connections and transactions.')
    }
  }

  private async cleanupDatabase(): Promise<void> {
    try {
      if (this.queryRunner) {
        await this.queryRunner.release()
      }
      await this.currentDatabase.destroy()
    } catch (error) {
      logger.error(`[Database Cleanup Error] ${error}`)
    }
  }

  public async synchronize(): Promise<void> {
    try {
      await this.initializeDatabase()

      // Todo: Add login backup

      await this.queryRunner!.commitTransaction()
      this.sendProgress(100)
    } catch (error) {
      sendMessageToMain(this.parentPort, { key: 'recovery_failed' })
      logger.error(`[Sync old database] Error: ${error}`)
      if (this.queryRunner) {
        await this.queryRunner.rollbackTransaction()
      }
    } finally {
      await this.cleanupDatabase()
    }
  }
}
