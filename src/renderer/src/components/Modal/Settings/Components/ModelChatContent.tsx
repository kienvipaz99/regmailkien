import type { IModelChat } from '@preload/types'
import { t } from 'i18next'
import React from 'react'

interface ModelChatContentProps {
  modelChat?: IModelChat
}

const ModelChatContent: React.FC<ModelChatContentProps> = ({ modelChat }) => {
  const modelChatContent: Record<IModelChat, JSX.Element> = {
    'gpt-4o': (
      <div className="font-medium text-slate-500 text-sm ml-3 col-span-4 self-start text-left mr-4 leading-6">
        <p className="text-[14px] text-[#555]">
          <strong className="text-red-500">{t('note')}</strong> {t('when_use')}
          <strong>API GPT-4o</strong> ({t('ver_optimized')}), {t('note_api_setting_1')}
        </p>
        <ul className="list-disc ml-6">
          <li>
            <strong className="text-[#555]">{t('token_input')}</strong>
            {t('note_api_setting_2')}
            <strong className="text-[#555]">{t('note_gpt_4o')}</strong>
          </li>
          <li>
            <strong className="text-[#555]">{t('token_output')}</strong> {t('note_api_setting_4')}
            <strong className="text-[#555]">{t('note_gpt_4o_1')}</strong>
          </li>
        </ul>

        <div className="mt-[10px]">
          <p className="my-[5px]">{t('note_gpt_4o_2')}</p>
          <ul className="list-disc ml-6">
            <li>
              <strong className="text-[#555]">4000 token</strong> {t('for_input')}.
              <strong className="text-[#555]">
                {t('price')}: $0.02 {t('for')} 4,000 token.
              </strong>
            </li>
            <li>
              <strong className="text-[#555]">4000 token</strong> {t('for_output')}.
              <strong className="text-[#555]">
                {' '}
                {t('price')}: $0.06 {t('for')} 4,000 token.
              </strong>
            </li>
          </ul>
        </div>
        <p>
          {t('note_api_setting_10')} <strong className="text-[#555]">8000 tokens</strong>.
          {t('price')}:<span className="font-bold text-[#555]">$0.08</span> (tương đương khoảng{' '}
          <strong className="text-[#555]">1,880 {t('note_api_setting_8')}</strong>,{' '}
          {t('note_api_setting_9')} 23,500 {t('vnd_usd')}).
        </p>
      </div>
    ),
    'gpt-4o-mini': (
      <div className="font-medium text-slate-500 text-sm ml-3 col-span-4 self-start text-left mr-4 leading-6">
        <p className="text-[14px] text-[#555]">
          <strong className="text-red-500">{t('note')}</strong> {t('when_use')}
          <strong> {t('api_gpt_4o_mini')} </strong> ({t('ver_mini')}), {t('note_api_setting_1')}
        </p>
        <ul className="list-disc ml-6">
          <li>
            <strong className="text-[#555]">{t('token_input')}</strong> {t('note_api_setting_2')}
            <strong className="text-[#555]"> {t('note_api_setting_3')}</strong>
          </li>
          <li>
            <strong className="text-[#555]">{t('token_output')}:</strong> {t('note_api_setting_4')}
            <strong className="text-[#555]"> {t('note_api_setting_5')}</strong>
          </li>
        </ul>

        <div className="mt-[10px]">
          <p className="my-[5px]">{t('note_api_setting_6')}</p>
          <ul className="list-disc ml-6">
            <li>
              <strong className="text-[#555]">4000 {t('token')} </strong>
              {t('for_input')}. {t('price')}
              <strong className="text-[#555] mx-1">
                $0.0006 {t('for')} 4,000 {t('token')}.
              </strong>
            </li>
            <li>
              <strong className="text-[#555]">4000 {t('token')}</strong> {t('for_input')}.{' '}
              {t('price')}
              <strong className="text-[#555] mx-1">
                $0.0024 {t('for')} 4,000 {t('token')}.
              </strong>
            </li>
          </ul>
        </div>
        <p>
          {t('note_api_setting_10')} <strong className="text-[#555]">8000 {t('token')}</strong>.
          {t('price')} <span className="font-bold text-[#555]">$0.003</span> (
          {t('note_api_setting_7')}
          <strong className="text-[#555]">70.5 {t('note_api_setting_8')}</strong>,{' '}
          {t('note_api_setting_9')} 23,500
          {t('vnd_usd')}).
        </p>
      </div>
    ),
    'gpt-4-turbo': (
      <div className="font-medium text-slate-500 text-sm ml-3 col-span-4 self-start text-left mr-4 leading-6">
        <p className="text-[14px] text-[#555]">
          <strong className="text-red-500">{t('note')}</strong>
          {t('when_use')}
          <strong>API GPT-4 Turbo</strong> ({t('ver_optimized_pro')}), {t('note_api_setting_1')}
        </p>
        <ul className="list-disc ml-6">
          <li>
            <strong className="text-[#555]">{t('token_input')}</strong> {t('note_api_setting_2')}{' '}
            <strong className="text-[#555]">{t('note_gpt_4o_turbo')}</strong>
          </li>
          <li>
            <strong className="text-[#555]">{t('token_input')}</strong> {t('note_api_setting_4')}{' '}
            <strong className="text-[#555]">{t('note_gpt_4o_turbo_1')}</strong>
          </li>
        </ul>

        <div className="mt-[10px]">
          <p className="my-[5px]">{t('note_gpt_4o_2')}</p>
          <ul className="list-disc ml-6">
            <li>
              <strong className="text-[#555]">4000 token</strong> {t('for_input')}. {t(' price')}:
              <strong className="text-[#555]"> $0.04 / 4,000 tokens.</strong>
            </li>
            <li>
              <strong className="text-[#555]">4000 token</strong> {t('for_output')}. {t(' price')}:
              <strong className="text-[#555]"> $0.12 / 4,000 tokens.</strong>
            </li>
          </ul>
        </div>
        <p>
          {t('note_api_setting_10')} <strong className="text-[#555]">8000 tokens</strong>.{' '}
          {t(' price')}:<span className="font-bold text-[#555]"> $0.16</span> (
          {t('note_api_setting_7')}
          <strong className="text-[#555]"> 3,760 {t('note_api_setting_8')}</strong>,{' '}
          {t('note_api_setting_9')} 23,500 {t('vnd_usd')}).
        </p>
      </div>
    ),
    ['gemini-1.5-flash']: (
      <div className="font-medium text-slate-500 text-sm ml-3 col-span-4 self-start text-left mr-4 leading-6">
        <p className="text-[14px] text-[#555]">
          <strong className="text-red-500">{t('note')}</strong> {t('gemini_description_1')}
          <strong> Gemini-1.5 Flash</strong>, {t('gemini_description_2')}
        </p>
        <ul className="list-disc ml-6">
          <li>
            <strong className="text-[#555]">{t('limits_of_use')}</strong> {t('limited_free_plan')}
            <strong className="text-[#555]">15 {t('request')}</strong> {t('one_minitue')},{' '}
            {t('gemini_description_3')}{' '}
            <strong className="text-[#555]">1,048,576 {t('token_input')}</strong>
            và <strong className="text-[#555]">8,192 {t('token_output')}</strong>{' '}
            {t('gemini_description_4')} 1,500 {t('request_day')}.
          </li>
          <li>
            <strong className="text-[#555]">{t('limits_of_features')}</strong>
            {t('gemini_description_5')}
          </li>
        </ul>
      </div>
    ),
    ['gemini-1.5-pro']: (
      <div className="font-medium text-slate-500 text-sm ml-3 col-span-4 self-start text-left mr-4 leading-6">
        <p className="text-[14px] text-[#555]">
          <strong className="text-red-500">{t('note')}</strong> {t('gemini_description_1')}
          <strong> Gemini-1.5 Pro</strong>, {t('gemini_free_notice')}
        </p>
        <ul className="list-disc ml-6">
          <li>
            <strong className="text-[#555]">{t('limits_of_use')}</strong>
            {t('limited_free_plan')}
            <strong className="text-[#555]"> 2 {t('request')} </strong> {t('one_minitue')},
            <strong className="text-[#555]"> 32,000 tokens {t('one_minitue')} </strong>
            và <strong className="text-[#555]"> 50 {t('request_day')}</strong>.{' '}
            {t('gemini_free_notice')}
          </li>
          <li>
            <strong className="text-[#555]">{t('limits_of_features')}</strong>{' '}
            {t('gemini_free_limit_5')}
          </li>
        </ul>
      </div>
    )
  }

  return modelChat && modelChatContent[modelChat] ? modelChatContent[modelChat] : null
}

export default ModelChatContent
