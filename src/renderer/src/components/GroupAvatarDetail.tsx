import { Avatar, AvatarProps, Group, GroupProps, Text } from '@mantine/core'
import StaticImage from '@renderer/assets/images'
import { FC } from 'react'

interface GroupAvatarDetailProps {
  title?: string
  desc?: string
  img?: string
  avatar?: AvatarProps
  group?: GroupProps
}

const GroupAvatarDetail: FC<GroupAvatarDetailProps> = ({
  desc = 'admin@phanmemmkt.vn',
  title = 'Admin',
  img,
  avatar,
  group
}): JSX.Element => {
  const imageLink = img ? `${img}` : StaticImage.userProfile
  return (
    <Group className="cursor-pointer" gap={'xs'} {...group}>
      <Avatar
        name={img ? undefined : title}
        radius="xl"
        src={imageLink}
        {...avatar}
        className="w-[30px] h-[40px] rounded-full"
      />
      <div className="w-[150px] overflow-hidden truncate">
        <Text size="md" fw={500} className="truncate">
          {title}
        </Text>
        <Text c="dimmed" size="xs" className="truncate">
          {desc}
        </Text>
      </div>
    </Group>
  )
}

export default GroupAvatarDetail
