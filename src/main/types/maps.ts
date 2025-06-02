import { MktBrowser } from '@vitechgroup/mkt-browser'
import { MktMaps } from '@vitechgroup/mkt-maps'

export interface IModuleAction {
  mktMaps: MktMaps
  mktBrowser: MktBrowser
  mktCaptcha?: object
  mktPhone?: object
}
