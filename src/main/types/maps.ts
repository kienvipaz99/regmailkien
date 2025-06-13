import { IBrowserProvider } from '@vitechgroup/mkt-browser'
import { MktMaps } from '@vitechgroup/mkt-maps'

export interface IModuleAction {
  mktMaps: MktMaps
  mktBrowser: IBrowserProvider
  mktCaptcha?: object
  mktPhone?: object
}
