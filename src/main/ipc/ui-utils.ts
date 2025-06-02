import { ipcMainHandle } from '@main/core/custom-ipc'
import { sendMessageRenderer } from '@main/core/electron'
import { createResponse, DB_FILE, logger, MASP } from '@main/core/nodejs'
import { AccountModel, PostModel } from '@main/database/models'
import { connectMktBrowserDb, exportCsvDialog, settings } from '@main/helper'
import {
  addTypeDialog,
  checkExistsProfile,
  deleteChromeCache,
  formatDataArray,
  zipFilesAndFolders
} from '@main/nodejs/helper'
import { clipboard, dialog } from 'electron'
import { map } from 'lodash'
import moment from 'moment'
import { promises } from 'node:fs'
import { basename, join, resolve } from 'node:path'

export const IpcMainUiUtil = (): void => {
  ipcMainHandle('uiUtil_copyByField', async (_, payload) => {
    const result = await AccountModel.readAllByField([{ key: payload.key, select: payload.select }])
    const text = formatDataArray(payload.value, result?.payload?.data ?? [])
    clipboard.writeText(text)
    return createResponse('copy_field_account_success', 'success', {
      data: true
    })
  })

  ipcMainHandle('uiUtil_showDialog', async (_, payload) => {
    const { type, isMulti = false } = payload
    const properties = addTypeDialog(type)
    return dialog
      .showOpenDialog({
        properties: properties.dialogType,
        filters: properties.filterType
      })
      .then(async (res) => {
        if (res.canceled) {
          return createResponse('close_dialog', 'success')
        }

        // if (maxImage && maxVideo) {
        //   const messages: string[] = []
        //   const { images, videos } = categorizeFiles(res.filePaths)
        //   if (images.length > maxImage) {
        //     messages.push(`${images.length}/${maxImage} images`)
        //   }

        //   if (videos.length > maxVideo) {
        //     messages.push(`${videos.length}/${maxVideo} videos`)
        //   }

        //   if (messages.length) {
        //     return createResponse(`max_file_limit|${messages.join(', ')}`, 'error')
        //   }
        // }

        return createResponse('get_file_success', 'success', {
          data: isMulti ? res.filePaths : res.filePaths[0]
        })
      })
  })

  ipcMainHandle('uiUtil_actionBy', async (_, payload) => {
    const listUidFailed: string[] = []

    map(payload.select, async (data) => {
      switch (payload.value) {
        case 'remove_cache': {
          deleteChromeCache(data).then((success) => !success && listUidFailed.push(data))

          break
        }

        case 'check_exits_profile': {
          checkExistsProfile(data).then((success) => !success && listUidFailed.push(data))

          break
        }

        case 'remove_profile': {
          const mktBrowserDb = await connectMktBrowserDb()
          const settingSystem = settings.get('setting_system')
          await mktBrowserDb.remove(data, settingSystem.profile_path)

          break
        }

        case 'backup_database': {
          const outZip = `${MASP}BACKUP-${moment().locale('vi').format('YYYY_MM_DD_hh_mm_ss')}.zip`
          zipFilesAndFolders([DB_FILE], join(data, outZip))
            .then((result) =>
              result
                ? sendMessageRenderer('backup_database_success')
                : sendMessageRenderer('backup_database_failed')
            )
            .catch(() => sendMessageRenderer('backup_database_failed'))

          break
        }
      }
    })

    return createResponse(`${payload.value}_finally`, 'success', {
      data: listUidFailed
    })
  })

  ipcMainHandle('uiUtil_getInfoFile', async (_, payload) => {
    try {
      const resolvedPath = resolve(payload)
      const stats = await promises.stat(resolvedPath)
      const fileContent = await promises.readFile(resolvedPath)
      const base64 = fileContent.toString('base64')

      return createResponse('get_info_file_success', 'success', {
        data: { name: basename(resolvedPath), size: stats.size, base64, path: payload }
      })
    } catch (error) {
      logger.error(`[Get File Info]: ${error}`)

      return createResponse('get_info_file_failed', 'error')
    }
  })

  ipcMainHandle('uiUtil_exportFileBy', async (_, payload) => {
    let isSuccess = false

    switch (payload.type) {
      case 'accounts_export': {
        const result = await AccountModel.readAllByField([
          { key: 'uid', select: payload.listUidSelect }
        ])

        isSuccess = await exportCsvDialog(result.payload?.data ?? [], payload.type)

        break
      }

      case 'post_export': {
        const result = await PostModel.readAllByField([
          { key: 'uuid', select: payload.listUidSelect }
        ])

        isSuccess = await exportCsvDialog(result.payload?.data ?? [], payload.type)

        break
      }
    }

    return createResponse(
      `export_file_by_${isSuccess ? 'success' : 'failed'}`,
      isSuccess ? 'success' : 'error'
    )
  })

  ipcMainHandle('uiUtil_getLocales', async (_, type) => {
    switch (type) {
      case 'en':
        return createResponse('get_locales_success', 'success')

      default:
        return createResponse('get_locales_success', 'success')
    }
  })
}
