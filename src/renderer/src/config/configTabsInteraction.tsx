import FormInteractionFriend from '@renderer/components/Form/FormInteractionFriend'
import FormInteractionGroup from '@renderer/components/Form/FormInteractionGroup'
import FormInteractionIndividual from '@renderer/components/Form/FormInteractionIndividual'
import FormPageInteraction from '@renderer/components/Form/FormPageInteraction'

export const configInteraction = [
  {
    id: 'individual',
    title: 'interaction_personal',
    content: FormInteractionIndividual
  },
  {
    id: 'friend',
    title: 'interaction_friend',
    content: FormInteractionFriend
  },
  {
    id: 'group',
    title: 'interaction_group',
    content: FormInteractionGroup
  },
  {
    id: 'page',
    title: 'interaction_page',
    content: FormPageInteraction
  }
]
