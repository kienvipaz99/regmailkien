import { logger } from '@main/core/nodejs'
import archiver from 'archiver'
import fs from 'node:fs'
import path from 'node:path'

export async function zipFilesAndFolders(
  filesAndFolders: string[],
  zipFilePath: string
): Promise<boolean> {
  if (!filesAndFolders || filesAndFolders.length === 0) {
    return false
  }

  return new Promise<boolean>((resolve, reject) => {
    try {
      const output = fs.createWriteStream(zipFilePath)
      const archive = archiver('zip', { zlib: { level: 9 } })

      output.on('close', () => {
        resolve(true)
      })

      archive.on('warning', (err) => {
        if (err.code !== 'ENOENT') {
          logger.warn(`Warning zip file and folder ${err}`)
        }
      })

      archive.on('error', (err) => {
        logger.error(`Error zip file and folder ${err}`)
        reject(err)
      })

      archive.pipe(output)

      for (const item of filesAndFolders) {
        const itemPath = path.resolve(item)

        try {
          const itemPath = path.resolve(item)
          if (fs.lstatSync(itemPath).isDirectory()) {
            archive.directory(itemPath, path.basename(itemPath))
          } else {
            archive.file(itemPath, { name: path.basename(itemPath) })
          }
        } catch (err) {
          logger.error(`Error zip file and folder ${itemPath}: ${err}`)
        }
      }

      archive.finalize()
    } catch (err) {
      logger.error(`Error zip file and folder ${err}`)
      reject(false)
    }
  })
}
