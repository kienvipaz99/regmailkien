import {
  IConfigChorme,
  IResponseCloseChormeHidemium,
  IResponseCreateProfileChorme,
  IResponseOpenChormeHidemium
} from '@main/types'
import axios from 'axios'
const port = 2222
export const CreateProfileChormeHidemium = async (
  configChorme: IConfigChorme
): Promise<IResponseCreateProfileChorme | null> => {
  const payload = {
    os: 'win',
    win: ['10'],
    osVersion: '10',
    browser: 'chrome',
    canvas: 'perfect',
    webGLImage: 'false',
    audioContext: 'true',
    webGLMetadata: 'true',
    clientRectsEnable: 'false',
    noiseFont: 'false',
    resolution: '1920x1080',
    proxy: configChorme.proxy,
    name: configChorme.name,
    checkname: true,
    folder_name: '',
    deviceMemory: 8,
    version: '137'
  }
  return await axios
    .post(`http://127.0.0.1:${port}/create-profile-custom`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response.data as IResponseCreateProfileChorme
    })
    .catch((error) => {
      console.log(error)

      return null
    })
}
export const OpenChormeHidemium = async (
  uuid: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<IResponseOpenChormeHidemium | null> => {
  const command = `--window-position=${x},${y} --window-size=${width},${height}`

  try {
    const response = await axios.get(
      `
http://127.0.0.1:${port}/openProfile`,
      {
        params: { uuid, command },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data as IResponseOpenChormeHidemium
  } catch (error) {
    console.error('❌ Error:', error)

    return null // Trả về null nếu có lỗi
  }
}
export const CloseChromeProfileHidemium = async (
  uuid: string
): Promise<IResponseCloseChormeHidemium | null> => {
  try {
    const response = await axios.get(`http://127.0.0.1:${port}/closeProfile`, {
      params: { uuid },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.data as IResponseCloseChormeHidemium
  } catch (error) {
    console.log(error)

    return null
  }
}
//check xem profile đã được mở  chưa
export const checkChromeProfileStatus = async (uuid: string): Promise<boolean> => {
  try {
    const response = await axios.get(`http://127.0.0.1:${port}/authorize`, {
      params: { uuid },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data.status
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra trạng thái profile:', error)
    return false
  }
}
export const deleteChromeProfile = async (uuid: string): Promise<boolean> => {
  try {
    await axios.delete(`http://127.0.0.1:${port}/v1/browser/destroy?is_local=false`, {
      data: { uuid_browser: [uuid] },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Kiểm tra nếu xoá thành công
    return true
  } catch (error) {
    console.error(`❌ Lỗi khi xoá profile ${uuid}:`, error)
    return false
  }
}
export const changeFingerprint = async (uuid: string): Promise<boolean> => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:${port}/v2/browser/change-fingerprint?is_local=false`,
      { profile_uuid: uuid },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('🚀 ~ changeFingerprint ~ response:', response.data)

    return true
  } catch (error) {
    console.error(`❌ Lỗi khi thay đổi fingerprint cho profile ${uuid}:`, error)
    return false
  }
}
