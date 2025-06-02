import { AccountModel, CategoryModel } from '@main/database/models'
import {
  Account,
  IDialogFilter,
  IDialogProperty,
  IDialogType,
  IFieldUpdateAndCheck,
  IProxyEntries,
  IResultAddTpeDialog
} from '@preload/types'
import { ITypeProxy, Proxy } from '@vitechgroup/mkt-proxy-client'
import { get, map, split, trim, zipObject } from 'lodash'
import { extensionImage, extensionVideo } from './data'

export const unZipAccountSync = async (
  template: string,
  template_sep: string,
  data: string,
  isAddCategory = false,
  categoryId?: string
): Promise<Account[]> => {
  const keys = split(template.trim(), template_sep).map((i) => i.trim())
  const datas = trim(data).split('\n')
  return await Promise.all(
    map(datas, async (value): Promise<Account> => {
      const attributes = value.split(template_sep)
      const accountData = zipObject(keys, attributes) as unknown as Account

      if (isAddCategory && categoryId) {
        attributes.push('category')
        const result = await CategoryModel.readAllByField([{ key: 'id', select: categoryId }])
        if (result.payload?.data?.length) {
          accountData.category = result?.payload?.data?.[0] ?? null
        }
      }

      // if (accountData._2fa) {
      //   accountData._2fa = words(accountData._2fa).join('').toUpperCase()
      // }

      return accountData
    })
  )
}

export const updateByClipboardBasedOnPayload = async (
  text: string,
  payload: IFieldUpdateAndCheck<Account, string[], string>
): Promise<string[]> => {
  const failedUpdates: string[] = []
  const entries = parseEntries(text, payload)

  for (const { uid, entry } of entries) {
    try {
      const result = await AccountModel.readAllByField([{ key: 'uid', select: [uid] }])
      if (!result?.payload?.data?.length) {
        failedUpdates.push(uid)
      } else {
        const accountToUpdate = result?.payload?.data?.[0]
        if (accountToUpdate) {
          accountToUpdate[payload.select] = entry
          await AccountModel.updateAccountByField({
            key: 'uid',
            select: [uid],
            value: accountToUpdate
          })
        }
      }
    } catch (error) {
      failedUpdates.push(uid)
    }
  }

  return failedUpdates
}

const parseEntries = (
  text: string,
  payload: IFieldUpdateAndCheck<Account, string[], string>
): IProxyEntries[] => {
  const splitEntries = text
    .split(/\n\r|\r\n|\n|\r/g)
    .map((line) => line.trim())
    .filter((line) => line)

  if (['proxy', 'recovery_email', 'user_agent'].includes(payload.key)) {
    const allowedUIDs = new Set(payload.value)

    return splitEntries
      .map((line) => {
        const [uid, entry] = line.split('|').map((part) => part.trim())
        return { uid, entry }
      })
      .filter((entry) => allowedUIDs.has(entry.uid) && entry.entry)
  } else {
    return payload.value.map((uid, index) => {
      return { uid, entry: splitEntries[index % splitEntries.length] }
    })
  }
}

const formatData = <T>(template: string, data: T): string => {
  if (template.includes('|')) {
    const keys = template.split('|')
    const values = keys.map((key) => get(data, key, ''))
    return values.join('|')
  }
  const text = get(data, template, '')?.toString()
  if (text) {
    return text
  }
  return ''
}

export const formatDataArray = <T>(template: string, dataArray: T[]): string => {
  return dataArray.map((data) => formatData(template, data)).join('\n')
}

export const addTypeDialog = (type: IDialogType): IResultAddTpeDialog => {
  const dialogType: IDialogProperty = []
  const filterType: IDialogFilter[] = []

  switch (type) {
    case 'folder': {
      dialogType.push('openDirectory')
      break
    }
    case 'image': {
      dialogType.push('multiSelections')
      filterType.push({
        name: 'Images',
        extensions: extensionImage
      })
      break
    }
    case 'file': {
      dialogType.push('openFile', 'treatPackageAsDirectory')
      break
    }
    case 'image_and_video': {
      dialogType.push('multiSelections')
      filterType.push({
        name: 'Images and Video',
        extensions: [...extensionImage, ...extensionVideo]
      })
      break
    }
    case 'video': {
      dialogType.push('multiSelections')
      filterType.push({
        name: 'Videos',
        extensions: extensionVideo
      })
      break
    }
    case 'audio': {
      break
    }
    case 'application': {
      break
    }
  }
  return { dialogType, filterType }
}
export const unZipProxySync = async (
  template: string,
  template_sep: string,
  data: string,
  proxyType: ITypeProxy
): Promise<Proxy[]> => {
  const keys = split(template.trim(), template_sep).map((i) => i.trim())
  const datas = trim(data).split('\n')
  return await Promise.all(
    map(datas, async (value): Promise<Proxy> => {
      const attributes = value.split(template_sep)
      const proxyData = zipObject(keys, attributes) as unknown as Proxy
      proxyData.proxyType = proxyType
      return proxyData
    })
  )
}
