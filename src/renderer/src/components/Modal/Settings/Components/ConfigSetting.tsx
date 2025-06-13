import { DefaultSettingProps } from '@renderer/types'
import type { EnumProxyProvider, ProxyProviderFacade } from '@vitechgroup/mkt-proxy-client'
import { TFunction } from 'i18next'
import { IconType } from 'react-icons'
import { GiSettingsKnobs } from 'react-icons/gi'
import { GoDatabase } from 'react-icons/go'
import SettingData from '../Tabs/SettingData'
import SettingSystem from '../Tabs/SettingSystem'

type TListTabSetting = {
  title: string
  Icon?: IconType
  Component: (props: DefaultSettingProps) => JSX.Element
}

export const ListTabSettings: TListTabSetting[] = [
  {
    title: 'setting.setting_system',
    Icon: GiSettingsKnobs,
    Component: SettingSystem
  },

  {
    title: 'setting.setting_data',
    Icon: GoDatabase,
    Component: SettingData
  }
]

export interface IListViewProxyItem {
  title: string
  href: string
  isNotBlank?: boolean
  desc?: (props: { t: TFunction }) => JSX.Element
}

export type FilteredProviderNameType = Exclude<
  EnumProxyProvider,
  'ip2_world_proxy' | 'luna_proxy' | 'net_proxy' | 's5_proxy' | 'zing_proxy'
>

export type IListViewProxy = Record<FilteredProviderNameType, IListViewProxyItem>

const proxymart: IListViewProxyItem = {
  title: 'Proxymart.net',
  href: 'https://proxymart.net/?ref=phanmemmkt.vn',
  desc: ({ t }) => {
    return (
      <div className="font-medium text-slate-500 text-sm ml-3 col-span-4 self-start text-left mr-4 leading-6">
        <div>{t('proxy.description')}</div>
        <div>{t('proxy.usage.economy')}</div>
        <div className="text-red-500">{t('proxy.notice.header')} </div>
        <div>{t('proxy.day1')}</div>
        <div>{t('proxy.day2to6')}</div>
        <div>{t('proxy.day7')}</div>
      </div>
    )
  }
}

// export const ListViewProxy: IListViewProxy = {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ListViewProxy: any = {
  kiot_proxy: {
    title: 'kiotproxy.com',
    href: 'https://app.kiotproxy.com/register?ref=PHANMEMMKT',
    desc: ({ t }) => {
      return (
        <div className="font-medium text-slate-500 text-sm ml-3 col-span-4 self-start text-left mr-4 leading-6">
          <div>{t('kiot.description')}</div>
          <div>{t('kiot.usage.economy')}</div>
          <div className="text-red-500">{t('proxy.notice.header')} </div>
          <div>{t('kiot.day1')}</div>
          <div>{t('kiot.day2to6')}</div>
          <div>{t('proxy.day7')}</div>
        </div>
      )
    }
  },
  proxy_mart_key: proxymart,
  proxy_mart_reseller: proxymart,
  proxy_v6: {
    title: 'Proxyv6.net',
    href: 'https://app.proxyv6.net/auth/register?ref=phanmemmkt',
    desc: ({ t }) => {
      return (
        <div className="font-medium text-slate-500 text-sm ml-3 col-span-4 self-start text-left mr-4 leading-6">
          <div>{t('proxyV6.description')}</div>
          <div>{t('proxyV6.usage.economy')}</div>
          <div className="text-red-500">{t('proxy.notice.header')} </div>
          <div>{t('proxyV6.day1')}</div>
          <div>{t('proxyV6.day2to6')}</div>
          <div>{t('proxy.day7')}</div>
        </div>
      )
    }
  },
  tm_proxy: {
    title: 'Tmproxy',
    href: ''
  },
  ww_proxy: {
    title: 'wwproxy.com',
    href: 'https://www.wwproxy.com/register?ref=171797',
    desc: ({ t }) => {
      return (
        <div className="font-medium text-slate-500 text-sm ml-3 col-span-4 self-start text-left mr-4 leading-6">
          <div>{t('wwProxy.description')}</div>
          <div>{t('wwProxy.usage.economy')}</div>
          <div className="text-red-500">{t('proxy.notice.header')} </div>
          <div>{t('wwProxy.day1')}</div>
          <div>{t('wwProxy.day2to6')}</div>
          <div>{t('proxy.day7')}</div>
        </div>
      )
    }
  }
}

export const arrProxymart: Array<ProxyProviderFacade | 'no_change_ip' | 'proxy_static'> = [
  'proxy_mart_key',
  'proxy_mart_reseller'
]
