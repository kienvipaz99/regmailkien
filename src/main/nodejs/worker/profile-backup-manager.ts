import { PROFILE_DIR, logger, sendMessageToMain } from '@main/core/nodejs'
import { IBackupProfileData, IPayloadProfileBackup, IProcessBackupProfile } from '@main/types'
import { ensureDir } from 'fs-extra'
import klaw from 'klaw'
import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { MessagePort } from 'node:worker_threads'

export class ProfileBackupManager {
  private workerPort: MessagePort
  private backupDestinationPath: string
  private userIdsToBackup: string[]

  private totalBytesCopied = 0
  private lastProgressReported = 0
  private totalBackupSize = 0
  private backupProfiles: IPayloadProfileBackup[] = []

  constructor(data: IBackupProfileData, workerPort: MessagePort) {
    this.workerPort = workerPort
    this.backupDestinationPath = data.path
    this.userIdsToBackup = data.listUid
  }

  public async startBackup(): Promise<void> {
    try {
      await this.prepareProfilesForBackup()

      if (this.totalBackupSize === 0) {
        return this.notifyCompletion()
      }

      for (const profile of this.backupProfiles) {
        const targetPath = join(this.backupDestinationPath, profile.uid)
        await this.copyProfileDirectory(profile.path, targetPath)
      }
    } catch (error) {
      this.notifyError('backup_process_error', error)
    }
  }

  private async prepareProfilesForBackup(): Promise<void> {
    for (const userId of this.userIdsToBackup) {
      const profilePath = join(PROFILE_DIR, `${userId}-win`)
      if (!existsSync(profilePath)) continue

      const directorySize = await this.calculateDirectorySize(profilePath)
      this.backupProfiles.push({ uid: userId, path: profilePath, size: directorySize })
      this.totalBackupSize += directorySize
    }
  }

  private async copyProfileDirectory(src: string, dest: string): Promise<void> {
    try {
      await this.copyDirectory(src, dest, (filePath, bytesCopied) => {
        this.updateProgress(filePath, bytesCopied)
      })
    } catch (error) {
      logger.error(`[Backup profile error]: ${error}`)
      this.notifyError(`backup_profile_error|${src}`, error)
    }
  }

  private async copyDirectory(
    sourceDir: string,
    destinationDir: string,
    onProgress: (filePath: string, bytesCopied: number) => void
  ): Promise<void> {
    for await (const file of klaw(sourceDir)) {
      const relativeFilePath = relative(sourceDir, file.path)
      const destinationPath = join(destinationDir, relativeFilePath)

      if (file.stats.isDirectory()) {
        await ensureDir(destinationPath)
      } else {
        await ensureDir(dirname(destinationPath))
        await this.copyFile(file.path, destinationPath, (bytes) => onProgress(file.path, bytes))
      }
    }
  }

  private async copyFile(
    source: string,
    destination: string,
    onProgress: (bytesCopied: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(source)
      const writeStream = createWriteStream(destination)

      readStream.on('data', (chunk) => onProgress(chunk.length))
      readStream.on('error', reject)
      writeStream.on('error', reject)
      writeStream.on('close', resolve)

      readStream.pipe(writeStream)
    })
  }

  private updateProgress(filePath: string, bytesCopied: number): void {
    this.totalBytesCopied += bytesCopied
    const progressPercentage = (this.totalBytesCopied / this.totalBackupSize) * 100

    if (progressPercentage - this.lastProgressReported >= 1 || progressPercentage === 100) {
      this.lastProgressReported = progressPercentage
      sendMessageToMain<IProcessBackupProfile>(this.workerPort, {
        key: 'backup_profile_process',
        data: {
          key: 'progress_update',
          filePath,
          progress: parseFloat(progressPercentage.toFixed(2)),
          bytesCopied: this.totalBytesCopied,
          totalBytes: this.totalBackupSize,
          copiedFormatted: this.formatBytes(this.totalBytesCopied),
          totalFormatted: this.formatBytes(this.totalBackupSize)
        }
      })
    }
  }

  private async calculateDirectorySize(directoryPath: string): Promise<number> {
    let totalSize = 0

    return new Promise((resolve, reject) => {
      klaw(directoryPath)
        .on('data', (item) => {
          if (!item.stats.isDirectory()) {
            totalSize += item.stats.size
          }
        })
        .on('end', () => resolve(totalSize))
        .on('error', reject)
    })
  }

  private formatBytes(bytes: number): string {
    const units = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
    if (bytes === 0) return '0 Bytes'
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, unitIndex)).toFixed(2)} ${units[unitIndex]}`
  }

  private notifyCompletion(): void {
    sendMessageToMain<IProcessBackupProfile>(this.workerPort, {
      key: 'backup_profile_process',
      data: {
        key: 'completed',
        progress: 100,
        bytesCopied: 0,
        totalBytes: 0,
        copiedFormatted: '0 Bytes',
        totalFormatted: '0 Bytes'
      }
    })
  }

  private notifyError(eventKey: string, error: unknown): void {
    sendMessageToMain<IProcessBackupProfile>(this.workerPort, {
      key: 'backup_profile_process',
      data: { key: eventKey, progress: -1 }
    })
    logger.error(`[Error]: ${error}`)
  }
}
