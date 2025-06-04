import { CommanAdb } from './commandadb'

export const settingApp = async (serinamephone: string, pathApp: string): Promise<boolean> => {
  try {
    const data = await CommanAdb(serinamephone, `install ${pathApp}`)
    if (data?.stderr === 'Success') {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}
