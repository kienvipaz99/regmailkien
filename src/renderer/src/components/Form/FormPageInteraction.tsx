import { InputGroupCheckboxNumber, ModalText, TextSpanBox } from '@renderer/components'
import type { IPropsFormGeneric } from '@renderer/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const FormPageInteraction = <T,>({ formik }: IPropsFormGeneric<T>): JSX.Element => {
  const { t } = useTranslation()

  const [modals, setModals] = useState({
    'action_page.list_uid': false,
    'action_page.comment_post_page.content': false
  })

  const openModal = (key: string): void => setModals((prev) => ({ ...prev, [key]: true }))

  return (
    <>
      <TextSpanBox
        underline
        color="blue"
        className="cursor-pointer mb-4"
        onClick={() => openModal('action_page.list_uid')}
      >
        {t('enter_id_page')}
      </TextSpanBox>

      <div className="flex">
        <div className="w-1/2 space-y-4">
          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_page.like_page.is_use',
              nameInputOne: 'action_page.like_page.from',
              nameInputTwo: 'action_page.like_page.to'
            }}
            configLabel={{
              label: t('like_page')
            }}
            suffix={t('page')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_page.follow_page.is_use',
              nameInputOne: 'action_page.follow_page.from',
              nameInputTwo: 'action_page.follow_page.to'
            }}
            configLabel={{
              label: t('follow_page')
            }}
            suffix={t('page')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_page.like_post_page.is_use',
              nameInputOne: 'action_page.like_post_page.from',
              nameInputTwo: 'action_page.like_post_page.to'
            }}
            configLabel={{
              label: t('like_post_page')
            }}
            suffix={t('post')}
            formik={formik}
          />
        </div>

        <div className="w-1/2 space-y-4">
          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_page.like_comment_post_page.is_use',
              nameInputOne: 'action_page.like_comment_post_page.from',
              nameInputTwo: 'action_page.like_comment_post_page.to'
            }}
            configLabel={{
              label: t('Thích bình luận bài viết page')
            }}
            suffix={t('post')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_page.comment_post_page.is_use',
              nameInputOne: 'action_page.comment_post_page.from',
              nameInputTwo: 'action_page.comment_post_page.to'
            }}
            configLabel={{
              label: t('comment_post_page')
            }}
            suffix={t('post')}
            formik={formik}
          />

          <TextSpanBox underline color="blue" className="cursor-pointer">
            <p onClick={() => openModal('action_page.comment_post_page.content')}>
              {t('text_enter_comment_page')}
            </p>
          </TextSpanBox>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-8 flex-wrap">
        <InputGroupCheckboxNumber
          config={{
            nameCheckbox: 'action_page.invite_friend_like_page.is_use',
            nameInputOne: 'action_page.invite_friend_like_page.from',
            nameInputTwo: 'action_page.invite_friend_like_page.to'
          }}
          configLabel={{
            label: t('invite_friend_like_page')
          }}
          suffix={t('page')}
          formik={formik}
        />

        <InputGroupCheckboxNumber
          config={{
            nameInputOne: 'action_page.invite_friend_like_page.invite.from',
            nameInputTwo: 'action_page.invite_friend_like_page.invite.to'
          }}
          configLabel={{
            label: t('each_page_invite')
          }}
          suffix={t('friend')}
          size="auto"
          formik={formik}
        />
      </div>

      <div className="mt-4 flex items-center gap-8 flex-wrap">
        <InputGroupCheckboxNumber
          config={{
            nameCheckbox: 'action_page.invite_friend_follow_page.is_use',
            nameInputOne: 'action_page.invite_friend_follow_page.from',
            nameInputTwo: 'action_page.invite_friend_follow_page.to'
          }}
          configLabel={{
            label: t('invite_friend_follow_page')
          }}
          suffix={t('page')}
          formik={formik}
        />

        <InputGroupCheckboxNumber
          config={{
            nameInputOne: 'action_page.invite_friend_follow_page.invite.from',
            nameInputTwo: 'action_page.invite_friend_follow_page.invite.to'
          }}
          configLabel={{
            label: t('each_page_invite')
          }}
          suffix={t('friend')}
          size="auto"
          formik={formik}
        />
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

export default FormPageInteraction
