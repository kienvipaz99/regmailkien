import type { ITypePost } from '@preload/types'
import type { IOptionSelectFormat } from '@renderer/types'

export const optionsTypeContent: IOptionSelectFormat<ITypePost>[] = [
  {
    label: 'Bình luận',
    value: 'comment'
  },

  {
    label: 'Nhắn tin',
    value: 'message'
  },

  {
    label: 'Bài viết',
    value: 'post'
  },

  {
    label: 'Seeding',
    value: 'seeding'
  },

  {
    label: 'Chia sẻ',
    value: 'share'
  }
]
