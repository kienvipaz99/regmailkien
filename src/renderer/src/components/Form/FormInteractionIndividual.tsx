import {
  CheckBoxField,
  InputGroupCheckboxNumber,
  ModalText,
  TextSpanBox
} from '@renderer/components'
import type { IPropsFormGeneric } from '@renderer/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const FormInteractionIndividual = <T,>({ formik }: IPropsFormGeneric<T>): JSX.Element => {
  const { t } = useTranslation()

  const [modals, setModals] = useState({
    'action_personal.comment_random_newscast.content': false,
    'action_personal.comment_random_video_watch.content': false,
    'action_personal.find_video_by_keyword.keyword': false
  })

  const openModal = (key: string): void => setModals((prev) => ({ ...prev, [key]: true }))

  return (
    <>
      <div className="flex">
        <div className="w-1/2 space-y-4">
          <CheckBoxField
            name="action_personal.read_notice.is_use"
            label={t('read_notification')}
            classCheckBox="min-h-[30px]"
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_personal.surf_newscast.is_use',
              nameInputOne: 'action_personal.surf_newscast.from',
              nameInputTwo: 'action_personal.surf_newscast.to'
            }}
            configLabel={{
              label: t('surf_feed')
            }}
            suffix={t('second')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_personal.surf_story.is_use',
              nameInputOne: 'action_personal.surf_story.from',
              nameInputTwo: 'action_personal.surf_story.to'
            }}
            configLabel={{
              label: t('surf_story')
            }}
            suffix="Story"
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_personal.like_post_newscast.is_use',
              nameInputOne: 'action_personal.like_post_newscast.from',
              nameInputTwo: 'action_personal.like_post_newscast.to'
            }}
            configLabel={{
              label: t('like_post_feed')
            }}
            suffix={t('post')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_personal.comment_random_newscast.is_use',
              nameInputOne: 'action_personal.comment_random_newscast.from',
              nameInputTwo: 'action_personal.comment_random_newscast.to'
            }}
            configLabel={{
              label: t('comment_random_newscast')
            }}
            suffix={t('post')}
            formik={formik}
          />

          <TextSpanBox
            underline
            color="blue"
            className="cursor-pointer"
            onClick={() => openModal('action_personal.comment_random_newscast.content')}
          >
            {t('Nhập nội dung bình luận (Mỗi nội dung 1 dòng)')}
          </TextSpanBox>

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_personal.share_random_post_to_wall.is_use',
              nameInputOne: 'action_personal.share_random_post_to_wall.from'
            }}
            configLabel={{
              label: t('share_random_post_to_wall')
            }}
            suffix={t('post')}
            formik={formik}
          />
          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_personal.comment_random_video_watch.is_use',
              nameInputOne: 'action_personal.comment_random_video_watch.from'
            }}
            configLabel={{
              label: t('Bình luận ngẫu nhiên video watch')
            }}
            suffix={t('video')}
            formik={formik}
          />

          <TextSpanBox
            underline
            color="blue"
            className="cursor-pointer"
            onClick={() => openModal('action_personal.comment_random_video_watch.content')}
          >
            {t('Nhập nội dung bình luận')}
          </TextSpanBox>
        </div>

        <div className="w-1/2 space-y-5">
          <InputGroupCheckboxNumber
            isShowPaddingCheckbox
            config={{
              nameInputOne: 'action_personal.find_video_by_keyword.from',
              nameInputTwo: 'action_personal.find_video_by_keyword.to'
            }}
            configLabel={{
              label: t('max_video_watch')
            }}
            suffix={t('second')}
            formik={formik}
          />
          <div className="flex items-center gap-3">
            <CheckBoxField
              name="action_personal.find_video_by_keyword.is_use"
              label={t('Tìm video theo từ khoá (Mỗi nội dung 1 dòng)')}
              classCheckBox="min-h-[30px]"
              formik={formik}
            />
            <TextSpanBox
              underline
              color="blue"
              className="cursor-pointer"
              onClick={() => openModal('action_personal.find_video_by_keyword.keyword')}
            >
              {t('Nhập từ khoá')}
            </TextSpanBox>
          </div>
          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_personal.surf_video_watch.is_use',
              nameInputOne: 'action_personal.surf_video_watch.from',
              nameInputTwo: 'action_personal.surf_video_watch.to'
            }}
            configLabel={{
              label: t('surf_video_watch')
            }}
            suffix={t('video')}
            formik={formik}
          />
          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_personal.follow_random_owner_video.is_use',
              nameInputOne: 'action_personal.follow_random_owner_video.from'
            }}
            configLabel={{
              label: t('follow_random_own_video')
            }}
            suffix="video"
            formik={formik}
          />
          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_personal.share_random_video_to_wall.is_use',
              nameInputOne: 'action_personal.share_random_video_to_wall.from'
            }}
            configLabel={{
              label: t('Chia sẻ ngẫu nhiêu video về tường')
            }}
            suffix="video"
            formik={formik}
          />
          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_personal.like_video_watch.is_use',
              nameInputOne: 'action_personal.like_video_watch.from',
              nameInputTwo: 'action_personal.like_video_watch.to'
            }}
            configLabel={{
              label: t('Like video watch từ ')
            }}
            suffix="Video"
            formik={formik}
          />
        </div>
      </div>

      {Object.keys(modals).map(
        (key) =>
          modals[key] && (
            <ModalText
              key={key}
              name={key}
              isShow={modals[key]}
              titleModal={key}
              setIsShow={(isShow) => setModals((prev) => ({ ...prev, [key]: isShow }))}
              formik={formik}
            />
          )
      )}
    </>
  )
}

export default FormInteractionIndividual
