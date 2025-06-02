import {
  InputGroupCheckboxNumber,
  ModalText,
  RadioField,
  TextSpanBox,
  WapperLabelForm
} from '@renderer/components'
import type { IPropsFormGeneric } from '@renderer/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const FormInteractionGroup = <T,>({ formik }: IPropsFormGeneric<T>): JSX.Element => {
  const { t } = useTranslation()

  const [modals, setModals] = useState({
    'action_designated_group.list_id_group': false,
    'action_designated_group.comment_post_designated_group.content': false
  })

  const openModal = (key: string): void => setModals((prev) => ({ ...prev, [key]: true }))

  const isInteractionAccount =
    formik?.getFieldProps('action_designated_group.type')?.value === 'group_account'

  return (
    <>
      <WapperLabelForm
        label={t('choose_interaction')}
        classWapper="[&>*]:flex [&>*]:items-center [&>*]:gap-5 mb-4 [&>span]:w-fit flex items-center gap-5 [&>span]:!py-0 [&>span]:!mb-0 [&>span]:font-semibold [&>span]:text-blue-600"
      >
        <RadioField
          name="action_designated_group.type"
          label={t('account_group')}
          value={'group_account'}
          formik={formik}
        />
        <RadioField
          name="action_designated_group.type"
          label={t('group_id')}
          value={'group_by_uid'}
          formik={formik}
        />
      </WapperLabelForm>

      {!isInteractionAccount && (
        <TextSpanBox
          underline
          color="blue"
          className="cursor-pointer mb-4"
          onClick={() => openModal('action_designated_group.list_id_group')}
        >
          {t('text_enter_group_id')}
        </TextSpanBox>
      )}

      <div className="flex">
        <div className="w-1/2 space-y-4">
          <InputGroupCheckboxNumber
            disabled={isInteractionAccount}
            config={{
              nameCheckbox: 'action_designated_group.auto_join_designated_group.is_use'
            }}
            configLabel={{
              label: t('join_group')
            }}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_designated_group.like_post_designated_group.is_use',
              nameInputOne: 'action_designated_group.like_post_designated_group.from',
              nameInputTwo: 'action_designated_group.like_post_designated_group.to'
            }}
            configLabel={{
              label: t('like_post_group')
            }}
            suffix={t('post')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_designated_group.like_comment_post_designated_group.is_use',
              nameInputOne: 'action_designated_group.like_comment_post_designated_group.from',
              nameInputTwo: 'action_designated_group.like_comment_post_designated_group.to'
            }}
            configLabel={{
              label: t('like_comment_post_group')
            }}
            suffix={t('post')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_designated_group.comment_post_designated_group.is_use',
              nameInputOne: 'action_designated_group.comment_post_designated_group.from',
              nameInputTwo: 'action_designated_group.comment_post_designated_group.to'
            }}
            configLabel={{
              label: t('comment_post_group')
            }}
            suffix={t('post')}
            formik={formik}
          />
        </div>

        <div className="w-1/2 space-y-4">
          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_designated_group.reply_comment_post_designated_group.is_use',
              nameInputOne: 'action_designated_group.reply_comment_post_designated_group.from',
              nameInputTwo: 'action_designated_group.reply_comment_post_designated_group.to'
            }}
            configLabel={{
              label: t('reply_comment_post')
            }}
            suffix={t('post')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_group_account.leave_group_account.is_use',
              nameInputOne: 'action_group_account.leave_group_account.from',
              nameInputTwo: 'action_group_account.leave_group_account.to'
            }}
            configLabel={{
              label: t('leave_group')
            }}
            suffix={t('group')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox:
                'action_group_account.leave_request_pending_approval_group_account.is_use',
              nameInputOne:
                'action_group_account.leave_request_pending_approval_group_account.from',
              nameInputTwo: 'action_group_account.leave_request_pending_approval_group_account.to'
            }}
            configLabel={{
              label: t('leave_groups_requesting_approval_of_articles')
            }}
            suffix={t('group')}
            formik={formik}
          />

          <TextSpanBox underline color="blue" className="cursor-pointer">
            <p
              onClick={() =>
                openModal('action_designated_group.comment_post_designated_group.content')
              }
            >
              {t('text_enter_comment_here')}
            </p>
          </TextSpanBox>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-8 flex-wrap">
        <InputGroupCheckboxNumber
          config={{
            nameCheckbox: 'action_designated_group.add_friend_in_designated_group.is_use',
            nameInputOne: 'action_designated_group.add_friend_in_designated_group.from',
            nameInputTwo: 'action_designated_group.add_friend_in_designated_group.to'
          }}
          configLabel={{
            label: t('add_friend_member')
          }}
          suffix={t('group')}
          formik={formik}
        />

        <InputGroupCheckboxNumber
          config={{
            nameInputOne: 'action_designated_group.add_friend_in_designated_group.add.from',
            nameInputTwo: 'action_designated_group.add_friend_in_designated_group.add.to'
          }}
          configLabel={{
            label: t('each_group')
          }}
          suffix={t('member')}
          size="auto"
          formik={formik}
        />
      </div>

      <div className="mt-4 flex items-center gap-8 flex-wrap">
        <InputGroupCheckboxNumber
          config={{
            nameCheckbox: 'action_designated_group.invite_friend_to_designated_group.is_use',
            nameInputOne: 'action_designated_group.invite_friend_to_designated_group.from',
            nameInputTwo: 'action_designated_group.invite_friend_to_designated_group.to'
          }}
          configLabel={{
            label: t('invite_friend')
          }}
          suffix={t('group')}
          formik={formik}
        />

        <InputGroupCheckboxNumber
          config={{
            nameInputOne: 'action_designated_group.invite_friend_to_designated_group.invite.from',
            nameInputTwo: 'action_designated_group.invite_friend_to_designated_group.invite.to'
          }}
          configLabel={{
            label: t('each_group')
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

export default FormInteractionGroup
