import type { ITypeAction, ITypePost } from '@preload/types'
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Account } from './AccountEntity'
import { Category } from './CategoryEntity'
import { CommonEntity } from './CommonEntity'

@Entity('post')
export class Post extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column('nvarchar', { default: null, nullable: true })
  title!: string | null

  @Column('nvarchar', { default: null, nullable: true })
  content!: string | null

  @Column('nvarchar', { default: 'post' })
  type_post!: ITypePost

  @Column('nvarchar', { default: 'text' })
  post_type!: ITypeAction

  @ManyToOne(() => Category, { nullable: true })
  category!: Category | null

  @ManyToMany(() => Account, (entity) => entity.posts, {
    onDelete: 'CASCADE',
    nullable: true
  })
  @JoinTable({
    name: 'accounts_posts'
  })
  accounts!: Account[] | null

  @Column('text', { default: null, nullable: true })
  attached!: string | null

  @Column('int', { default: 0, nullable: true })
  quantity_attached!: number

  @Column('text', { default: null, nullable: true })
  description!: string | null
}
