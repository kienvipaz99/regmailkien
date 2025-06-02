import { GoogleGenerativeAI } from '@google/generative-ai'
import { PROFILE_DIR, logger } from '@main/core/nodejs'
import { CategoryModel } from '@main/database/models'
import { IResponseCheckAi } from '@main/types'
import axios from 'axios'
import { promises } from 'fs'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { OpenAI } from 'openai'
import { Post } from '../../database/entities'

export const checkExistsProfile = async (uid: string): Promise<boolean> => {
  const pathProfile = join(PROFILE_DIR, uid)
  return existsSync(pathProfile)
}

export const deleteChromeCache = async (uid: string): Promise<boolean> => {
  try {
    const pathProfile = join(PROFILE_DIR, uid)
    const cachePath = join(pathProfile, 'Default', 'Cache')
    const codeCachePath = join(pathProfile, 'Default', 'Code Cache')
    if (existsSync(cachePath) && existsSync(codeCachePath)) {
      await promises.rm(cachePath, { recursive: true, force: true })
      await promises.rm(codeCachePath, { recursive: true, force: true })
      return true
    }
  } catch (error) {
    console.error(`Delete cache error: ${error}`)
  }
  return false
}

export const checkApiKeyGemini = async (
  keyApi: string,
  model_chat: string
): Promise<IResponseCheckAi> => {
  try {
    const googleGenerativeAI = new GoogleGenerativeAI(keyApi)
    const model = googleGenerativeAI.getGenerativeModel({ model: model_chat })
    await model.generateContent(['t'])
    return 200
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          return 401
        } else if (error.response.status === 429) {
          return 429
        } else {
          return null
        }
      } else if (error.request) {
        return null
      } else {
        return null
      }
    }
    return 500
  }
}

export const checkApiKeyOpenAI = async (keyApi: string): Promise<IResponseCheckAi> => {
  try {
    const openAI = new OpenAI({ apiKey: keyApi })
    await openAI.models.list()
    return 200
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          return 401
        } else if (error.response.status === 429) {
          return 429
        } else {
          return null
        }
      } else if (error.request) {
        return null
      } else {
        return null
      }
    }
    return 500
  }
}

export const getCategoryAndCreatePost = async (
  categoryId: string,
  postData: Partial<Post>
): Promise<Post | null> => {
  try {
    const categoryResult = await CategoryModel.readAllByField([
      { key: 'id', select: categoryId ?? '' }
    ])
    const category = categoryResult.payload?.data?.[0]
    return Post.create({ ...postData, category })
  } catch (error) {
    console.error('Failed to get category or create post:', error)
    return null
  }
}

export const getPublicIP = async (): Promise<string> => {
  try {
    const response = await axios.get('https://key.phanmemmkt.vn/ipCheck')
    return response.data
  } catch (error) {
    logger.error(`[Get public IP] Error: ${error}`)
  }
  return ''
}
