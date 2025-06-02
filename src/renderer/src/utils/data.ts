import { ITypeProxy, ProviderNameType } from '@vitechgroup/mkt-proxy-client'
import { IOptionSelectFormat } from '../types'

export const dataOptionProxy = [
  { value: 'proxymart_proxy_rotating', label: 'Proxy Mart' },
  // { value: 'proxyv6_proxy', label: 'Proxy v6' },
  { value: 'ww_proxy', label: 'WWProxy' },
  { value: 'kiot_proxy', label: 'Kiotproxy' }
]

export const configOptionConfigProxy: IOptionSelectFormat<ProviderNameType>[] = [
  { value: 'tm_proxy', label: 'TMPROXY' },
  { value: 'kiot_proxy', label: 'Kiotproxy' },
  { value: 'ww_proxy', label: 'WWProxy' },
  { value: 'proxy_mart_key', label: 'Proxy Mart' },
  // { value: 'proxy_mart_reseller', label: 'Proxy Mart' },
  // { value: 'net_proxy', label: 'NetProxy.io' },
  // { value: 'zing_proxy', label: 'ZingProxy' },
  { value: 'proxy_v6', label: 'Proxy v6' }
  // { value: 'luna_proxy', label: 'Lunaproxy' },
  // { value: 'ip2_world_proxy', label: 'IP2Word' },
  // { value: 's5_proxy', label: 'S5Proxy' }
]

export const configOptionProtocolProxy: IOptionSelectFormat<ITypeProxy>[] = [
  { value: 'v6_rotate', label: 'Proxy v6' }
  // { value: 'SOCKS5', label: 'SOCKS5' }
]
