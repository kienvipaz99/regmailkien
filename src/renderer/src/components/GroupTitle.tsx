import React, { memo } from 'react'

export interface GroupTitleProps {
  title: string
  icon?: React.ReactNode
  hr?: boolean
}

const GroupTitle: React.FC<GroupTitleProps> = (props) => {
  const { title, icon, hr } = props
  return (
    <div className={`font-bold text-base flex items-center`}>
      {icon}
      <span className="ml-2 whitespace-nowrap">{title}</span>
      {hr && <hr className="w-[70%] text-center relative top-[5px] pl-3 left-7" />}
    </div>
  )
}

GroupTitle.displayName = 'GroupTitle'

export default memo<GroupTitleProps>(GroupTitle)
