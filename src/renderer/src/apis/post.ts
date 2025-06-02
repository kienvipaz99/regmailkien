import type { IIpcCustomRenderer, PostArgRoutes } from '@preload/types'

export const PostApi: IIpcCustomRenderer<PostArgRoutes> = {
  create: async (payload) => window.api.post.create(payload),
  readPostByParams: async (payload) => window.api.post.readPostByParams(payload),
  removeByField: async (payload) => window.api.post.removeByField(payload),
  updatePostByField: async (payload) => window.api.post.updatePostByField(payload),
  readPostByField: async (payload) => window.api.post.readPostByField(payload)
}
