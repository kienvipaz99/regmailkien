import { EnumProxyProvider, ITypeProxy } from '@vitechgroup/mkt-proxy-client'
import { IOptionSelectFormat } from '../types'

export const dataOptionProxy = [
  { value: 'proxymart_proxy_rotating', label: 'Proxy Mart' },
  // { value: 'proxyv6_proxy', label: 'Proxy v6' },
  { value: 'ww_proxy', label: 'WWProxy' },
  { value: 'kiot_proxy', label: 'Kiotproxy' }
]

export const configOptionConfigProxy: IOptionSelectFormat<string>[] = [
  { value: EnumProxyProvider.TM_PROXY, label: 'TMPROXY' },
  { value: EnumProxyProvider.KIOT_PROXY, label: 'Kiotproxy' },
  { value: EnumProxyProvider.WWPROXY, label: 'WWProxy' },
  { value: EnumProxyProvider.PROXY_MART_KEY, label: 'Proxy Mart' },
  { value: 'shared_key_pool', label: '2 Proxy' }
]

export const configOptionProtocolProxy: IOptionSelectFormat<ITypeProxy>[] = [
  { value: 'v6_rotate', label: 'Proxy v6' }
  // { value: 'SOCKS5', label: 'SOCKS5' }
]
