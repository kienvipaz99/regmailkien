import { ButtonFlowbite, CheckBoxField } from '@renderer/components'
import { cn } from '@renderer/helper'
import { Modal } from 'flowbite-react'
import { isEmpty } from 'lodash'
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type TermsPopupProps = {
  isShow: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
  onClick?: () => void
}

const ModalTerm: FC<TermsPopupProps> = ({ isShow, setIsShow, onClick }): JSX.Element => {
  const { t } = useTranslation()
  const items = t('privacyCommitments', { returnObjects: true })
  const getTimeAcceptTerm = (): string | null => localStorage.getItem('accept_term')
  const [isChecked, setIsChecked] = useState(Boolean(getTimeAcceptTerm()))
  const [isAccept, setIsAccept] = useState(Boolean(getTimeAcceptTerm()))
  const [canCheck, setCanCheck] = useState(false)
  const timeAcceptTerm = useMemo(() => {
    const raw = getTimeAcceptTerm()
    if (!raw) return null
    const time = JSON.parse(raw)
    if (!time) return null
    return new Date(time)?.toLocaleString()
  }, [isShow])
  const handleScroll = (e): void => {
    const el = e?.target as HTMLDivElement
    if (el) {
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10
      if (isAtBottom) {
        setCanCheck(true)
      }
    }
  }

  const handleCheckboxChange = (): void => {
    setIsChecked(!isChecked)
    if (isChecked) setIsAccept(false)
  }
  const handleClose = (): void => {
    if (!isChecked) return
    onClick && onClick()
    setIsShow && setIsShow(false)
  }
  const handleSubmit = (): void => {
    if (isChecked || isAccept) {
      localStorage.setItem('accept_term', JSON.stringify(Date.now()))
      setIsShow && setIsShow(false)
      onClick && onClick()
    }
  }
  const handleCancelTerm = (): void => {
    localStorage.removeItem('accept_term')
    window?.api?.app?.closeApp()
  }
  useEffect(() => {
    setTimeout(() => {
      if (isShow) {
        const modalBody = document.querySelector('.modal-body-scroll') as HTMLDivElement
        if (modalBody) {
          modalBody.scrollTop = 0
          setCanCheck(false)
        }
      }
    }, 0)
  }, [isShow])
  return (
    <Modal show={isShow} onClose={handleClose} size={'4xl'}>
      <Modal.Header className="custom-title">
        <span dangerouslySetInnerHTML={{ __html: t('terms_acceptance_title') }} />
      </Modal.Header>
      <Modal.Body
        className="overflow-y-scroll custom_scroll h-[80vh] min-h-0 modal-body-scroll [&_a]:!text-blue-600 [&_a]:underline"
        onScroll={handleScroll}
      >
        <div className="space-y-5">
          <p className="indent-4 text-sm">
            <span dangerouslySetInnerHTML={{ __html: t('terms_intro') }} />
          </p>
          <h3 className="text-xl font-bold">{t('usage_rules_title')}</h3>
          <p className="indent-6 text-sm">
            <span dangerouslySetInnerHTML={{ __html: t('software_description') }} />
          </p>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('law_cyber_security') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('law_civil') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('decree_72_2013') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('decree_13_2023') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('law_consumer_protection') }} />
            </li>
          </ul>
          <p className="indent-6 text-sm">
            <span dangerouslySetInnerHTML={{ __html: t('allowed_usage_title') }} />
          </p>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('allowed_usage_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('allowed_usage_2') }} />
            </li>
          </ul>
          <p className="indent-6 text-sm font-bold text-red-600">
            <span dangerouslySetInnerHTML={{ __html: t('prohibited_usage_title') }} />
          </p>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('prohibited_usage_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('prohibited_usage_2') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('prohibited_usage_3') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('prohibited_usage_4') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('prohibited_usage_5') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('prohibited_usage_6') }} />
            </li>
          </ul>
          <p className="indent-6 text-sm">
            <span dangerouslySetInnerHTML={{ __html: t('restricted_actions_title') }} />
          </p>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('restricted_actions_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('restricted_actions_2') }} />
            </li>
          </ul>
          <p className="indent-6 text-sm font-semibold">
            <span dangerouslySetInnerHTML={{ __html: t('customer_responsibility_title') }} />
          </p>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('customer_responsibility_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('customer_responsibility_2') }} />
            </li>
          </ul>
          <h3 className="text-xl font-bold">{t('data_privacy_title')}</h3>
          <p className="indent-6 text-sm">
            <span dangerouslySetInnerHTML={{ __html: t('data_collection_purpose') }} />
          </p>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('data_collection_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('data_collection_2') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('data_collection_3') }} />
            </li>
          </ul>
          <p className="indent-6 text-sm font-semibold">
            <span dangerouslySetInnerHTML={{ __html: t('privacy_commitment_title') }} />
          </p>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('privacy_commitment_1') }} />
            </li>
            {Array.isArray(items)
              ? items.map((item, index) => (
                  <li key={index}>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))
              : null}
          </ul>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <p className="indent-6 text-sm font-semibold">
              <span
                dangerouslySetInnerHTML={{ __html: t('customer_privacy_responsibility_title') }}
              />
            </p>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('customer_privacy_responsibility_1') }} />
            </li>
          </ul>
          <h3 className="text-xl font-bold">{t('third_party_resources_title')}</h3>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('third_party_resources_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('third_party_resources_2') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('third_party_resources_3') }} />
              <ul className="list-disc pl-6">
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t('third_party_resources_3_1') }} />
                </li>
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t('third_party_resources_3_2') }} />
                </li>
              </ul>
            </li>
          </ul>
          <h3 className="text-xl font-bold">{t('software_ownership_title')}</h3>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('software_ownership_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('software_ownership_2') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('software_ownership_3') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('software_ownership_4') }} />
            </li>
          </ul>
          <h3 className="text-xl font-bold">{t('performance_liability_title')}</h3>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('performance_liability_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('performance_liability_2') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('performance_liability_3') }} />
            </li>
          </ul>
          <p className="indent-6 text-sm font-semibold">{t('disclaimer_title')}</p>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('disclaimer_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('disclaimer_2') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('disclaimer_3') }} />
            </li>
          </ul>
          <h3 className="text-xl font-bold">{t('warranty_support_title')}</h3>
          <p className="indent-6 text-sm">
            <span dangerouslySetInnerHTML={{ __html: t('warranty_support_intro') }} />
          </p>
          <p className="indent-6 text-sm font-semibold">{t('warranty_policy_title')}</p>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('warranty_policy_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('warranty_conditions_title') }} />
              <ul className="list-disc pl-6">
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t('warranty_conditions_1') }} />
                </li>
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t('warranty_conditions_2') }} />
                </li>
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t('warranty_conditions_3') }} />
                </li>
              </ul>
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('warranty_request_title') }} />
              <ul className="list-disc pl-6">
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t('warranty_request_1') }} />
                </li>
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t('warranty_request_2') }} />
                </li>
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t('warranty_request_3') }} />
                </li>
              </ul>
            </li>
          </ul>
          <p className="indent-6 text-sm font-semibold">{t('technical_support_title')}</p>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('technical_support_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('technical_support_2') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('technical_support_3') }} />
            </li>
          </ul>
          <h3 className="text-xl font-bold">{t('termination_title')}</h3>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('termination_1') }} />
              <ul className="list-disc pl-6">
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t('termination_1_1') }} />
                </li>
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t('termination_1_2') }} />
                </li>
              </ul>
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('termination_2') }} />
            </li>
          </ul>
          <h3 className="text-xl font-bold">{t('terms_amendment_title')}</h3>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('terms_amendment_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('terms_amendment_2') }} />
            </li>
          </ul>
          <h3 className="text-xl font-bold">{t('applicable_law_title')}</h3>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('applicable_law_1') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('applicable_law_2') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('applicable_law_3') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('applicable_law_4') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('applicable_law_5') }} />
            </li>
          </ul>
          <h3 className="text-xl font-bold">{t('agreement_login_title')}</h3>
          <p className="indent-6 text-sm">
            <span dangerouslySetInnerHTML={{ __html: t('agreement_login_text') }} />
          </p>
          <p className="indent-6 text-sm">
            <span dangerouslySetInnerHTML={{ __html: t('contact_info') }} />
          </p>
          <h3 className="text-xl font-bold">{t('definitions_title')}</h3>
          <ul className="flex flex-col gap-3 indent-6 text-sm list-disc pl-6">
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('definition_software') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('definition_customer') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('definition_third_party') }} />
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: t('definition_personal_data') }} />
            </li>
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-between items-center gap-3 px-5 py-3">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full flex flex-col gap-2">
            <CheckBoxField
              name="agree-to-terms-of-us22"
              label={t('checkbox_read_label')}
              classCheckBox="[&>label]:font-semibold"
              checked={isChecked}
              onChange={handleCheckboxChange}
              disabled={!canCheck}
            />
            <CheckBoxField
              name="agree-to-terms-of-us23"
              label={t('checkbox_agree_label')}
              classCheckBox="[&>label]:font-semibold"
              checked={isAccept}
              onChange={(e) => setIsAccept(e.target.checked)}
              disabled={!canCheck || !isChecked}
            />
            <p className={cn('text-xs hidden', !isEmpty(timeAcceptTerm) && 'block')}>
              {t('accepted_terms_time')} {timeAcceptTerm}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <ButtonFlowbite type="submit" color="failure" onClick={handleCancelTerm}>
            {t('disagree_button')}
          </ButtonFlowbite>
          <ButtonFlowbite
            type="submit"
            color="blue"
            onClick={handleSubmit}
            disabled={!isChecked || !isAccept}
          >
            {t('agree_button')}
          </ButtonFlowbite>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalTerm
