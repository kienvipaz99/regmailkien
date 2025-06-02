import { queryClient } from '@renderer/context'

type ActionKeys<T extends string> = Record<T, string>

export const actionKeys = <T extends string>(key: string, arrkeys: T[] = []): ActionKeys<T> => {
  const obj = arrkeys.reduce(
    (total, item) => ({ ...total, [item]: `${key}:${item}` }),
    {} as Record<T, string>
  )

  return { ...obj }
}

export const queryKeys = {
  auth: actionKeys('auth', ['his', 'user'] as const),
  category: actionKeys('category', ['readByPost', 'readByAccount', 'readByGroup'] as const),
  account: actionKeys('account', ['counterTotalLiveAndDie', 'readAllByParams'] as const),
  post: actionKeys('post', ['readAll'] as const),
  setting: actionKeys('setting', [
    'readSettingSystem',
    'readSettingApi',
    'readSettingProxy',
    'readSettingHistory'
  ] as const),
  script: actionKeys('script', ['readAll'] as const),
  action: actionKeys('action', [
    'readHistoryBy',
    'readStatusCloseChrome',
    'readActionBy',
    'readStatusDownload'
  ] as const),
  thirdParty: actionKeys('thirdParty', ['listDomainMailInboxes', 'listDomain1SecMail'] as const),
  gMap: actionKeys('gMap', ['readAllByParams'] as const),
  address: actionKeys('address', ['readAllProvince', 'readAllDistrict']),
  proxy: actionKeys('proxy', [
    'readAllProxyStatic',
    'readAllHistoryProxy',
    'readAllKeyProxy'
  ] as const)
}

export const queriesToInvalidate = (queryKeys: string[]): void => {
  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: [key] })
  })
}
