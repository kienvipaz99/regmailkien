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

const FormInteractionFriend = <T,>({ formik }: IPropsFormGeneric<T>): JSX.Element => {
  const { t } = useTranslation()

  const [modals, setModals] = useState({
    'action_friend.list_uid': false,
    'action_friend.comment_post_friend.content': false,
    'action_friend.send_message_friend.content': false,
    'action_friend.happy_birthday_friend.content': false
  })

  const openModal = (key: string): void => setModals((prev) => ({ ...prev, [key]: true }))

  const isInteractionUid = formik?.getFieldProps('action_friend.type')?.value === 'friend_account'

  return (
    <>
      <div className="flex items-center [&>*]:w-1/2 mb-4">
        <WapperLabelForm
          label={t('interaction_by_uid')}
          classWapper="[&>*]:flex [&>*]:items-center [&>*]:gap-5 mb-4 [&>span]:w-fit flex items-center gap-5 [&>span]:!py-0 [&>span]:!mb-0 [&>span]:font-semibold [&>span]:text-blue-600"
        >
          <RadioField
            name="action_friend.type"
            label={t('friend_account')}
            value={'friend_account'}
            formik={formik}
          />
          <RadioField
            name="action_friend.type"
            label={t('by_uid')}
            value={'by_uid'}
            formik={formik}
          />
        </WapperLabelForm>

        {formik?.getFieldProps('action_friend.type')?.value === 'by_uid' && (
          <TextSpanBox
            underline
            color="blue"
            className="cursor-pointer"
            onClick={() => openModal('action_friend.list_uid')}
          >
            {t('text_enter_uid_here')}
          </TextSpanBox>
        )}
      </div>
      <div className="flex">
        <div className="w-1/2 space-y-4">
          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_friend.like_post_friend.is_use',
              nameInputOne: 'action_friend.like_post_friend.from',
              nameInputTwo: 'action_friend.like_post_friend.to'
            }}
            configLabel={{
              label: t('like_post_friend')
            }}
            suffix={t('post')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_friend.add_friend_suggest.is_use',
              nameInputOne: 'action_friend.add_friend_suggest.from',
              nameInputTwo: 'action_friend.add_friend_suggest.to'
            }}
            configLabel={{
              label: t('add_friend_by_suggest')
            }}
            suffix={t('friend')}
            formik={formik}
            disabled={isInteractionUid}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_friend.accept_friend_request.is_use',
              nameInputOne: 'action_friend.accept_friend_request.from',
              nameInputTwo: 'action_friend.accept_friend_request.to'
            }}
            disabled={isInteractionUid}
            configLabel={{
              label: t('accept_friend')
            }}
            suffix={t('friend')}
            formik={formik}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_friend.unfriend_already_added.is_use',
              nameInputOne: 'action_friend.unfriend_already_added.from',
              nameInputTwo: 'action_friend.unfriend_already_added.to'
            }}
            configLabel={{
              label: t('unfriend')
            }}
            suffix={t('friend')}
            formik={formik}
            disabled={isInteractionUid}
          />

          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_friend.add_friend_of_friend.is_use',
              nameInputOne: 'action_friend.add_friend_of_friend.from',
              nameInputTwo: 'action_friend.add_friend_of_friend.to'
            }}
            configLabel={{
              label: t('add_friend_by_friend')
            }}
            suffix={t('friend')}
            disabled={isInteractionUid}
            formik={formik}
          />
        </div>

        <div className="w-1/2 space-y-4">
          <InputGroupCheckboxNumber
            config={{
              nameCheckbox: 'action_friend.comment_post_friend.is_use',
              nameInputOne: 'action_friend.comment_post_friend.from',
              nameInputTwo: 'action_friend.comment_post_friend.to'
            }}
            configLabel={{
              label: t('comment_post_friend')
            }}
            suffix={t('post')}
            formik={formik}
          />

          <TextSpanBox underline color="blue" className="cursor-pointer">
            <p onClick={() => openModal('action_friend.comment_post_friend.content')}>
              {t('text_enter_comment_here')}
            </p>
          </TextSpanBox>

          <InputGroupCheckboxNumber
            disabled={isInteractionUid}
            config={{
              nameCheckbox: 'action_friend.send_message_friend.is_use',
              nameInputOne: 'action_friend.send_message_friend.from',
              nameInputTwo: 'action_friend.send_message_friend.to'
            }}
            configLabel={{
              label: t('random_message_friend')
            }}
            suffix={t('friend')}
            formik={formik}
          />

          <TextSpanBox
            underline
            color="blue"
            className="cursor-pointer"
            onClick={() => openModal('action_friend.send_message_friend.content')}
          >
            {t('text_enter_message_here')}
          </TextSpanBox>

          <InputGroupCheckboxNumber
            disabled={isInteractionUid}
            config={{
              nameCheckbox: 'action_friend.happy_birthday_friend.is_use',
              nameInputOne: 'action_friend.happy_birthday_friend.from',
              nameInputTwo: 'action_friend.happy_birthday_friend.to'
            }}
            configLabel={{
              label: t('happy_birthday_friend')
            }}
            suffix={t('friend')}
            formik={formik}
          />

          <TextSpanBox
            onClick={() => openModal('action_friend.happy_birthday_friend.content')}
            underline
            color="blue"
            className="cursor-pointer"
          >
            {t('text_enter_birthday_message_here')}
          </TextSpanBox>
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

export default FormInteractionFriend
