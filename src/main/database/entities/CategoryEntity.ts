import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { CommonEntity } from './CommonEntity'

@Entity('category')
@Index(['name', 'category_type'], { unique: true })
export class Category extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('nvarchar', { nullable: false })
  name!: string

  @Column('boolean', { nullable: false, default: true })
  is_trash!: boolean

  @Column('nvarchar', { default: 'account' })
  category_type!: 'group' | 'post' | 'account'
}
