import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Category } from './CategoryEntity'
import { CommonEntity } from './CommonEntity'
import { Post } from './PostEntity'

@Entity('account', { orderBy: { uid: 'DESC' } })
export class Account extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column('varchar', { unique: true })
  uid!: string

  @Column('varchar')
  password!: string

  @Column('varchar', { nullable: true })
  email!: string | null

  @Column('varchar', { nullable: true })
  pass_email!: string | null

  @Column('varchar', { nullable: true })
  user_agent!: string | null

  @Column('varchar', { nullable: true })
  proxy!: string | null

  @Column('varchar', { nullable: true })
  recovery_email!: string | null

  @Column('varchar', { nullable: true })
  pass_recovery_email!: string | null

  @Column('varchar', { nullable: true })
  token!: string | null

  @Column('text', { nullable: true })
  cookie!: string | null

  @Column('nvarchar', { nullable: true })
  name!: string | null

  @Column('varchar', { nullable: true })
  avatar!: string | null

  @Column('varchar', { nullable: true })
  cover!: string | null

  @Column('varchar', { nullable: true })
  birthday!: string | null

  @Column('nvarchar', { nullable: true, default: 'ORTHER' })
  gender!: string | null

  @Column('nvarchar', { nullable: true })
  phone_number!: string | null

  @Column('nvarchar', { nullable: true })
  address!: string | null

  @Column('nvarchar', { nullable: true })
  created_time!: string | null

  @Column('int', { default: 0, nullable: true })
  friend_count!: number

  @Column('nvarchar', { nullable: true })
  refresh_token_mail!: string | null

  @Column('nvarchar', { nullable: true })
  access_token_mail!: string | null

  @Column('boolean', { default: true })
  status!: boolean

  @Column('boolean', { default: true })
  is_show!: boolean

  @Column('nvarchar', { nullable: true })
  note!: string | null

  @Column('nvarchar', { nullable: true })
  last_action!: string | null

  @Column('nvarchar', { nullable: true })
  last_time_action!: string | null

  @Column('nvarchar', { nullable: true })
  checkpoint_state!: string | null

  @ManyToOne(() => Category)
  category!: Category | null

  @Column('int', { nullable: true })
  port!: number | null

  @Column('text', { nullable: true })
  log_pass!: string | null

  @ManyToMany(() => Post, (entity) => entity.accounts, {
    onDelete: 'CASCADE',
    nullable: true
  })
  posts!: Post[]
}
