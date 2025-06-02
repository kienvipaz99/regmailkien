import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { CommonEntity } from './CommonEntity'

@Entity('account_gmail')
@Index(['gmail'], { unique: true })
export class AccountGmail extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('nvarchar', { nullable: false })
  gmail!: string

  @Column('nvarchar', { nullable: false })
  password!: string
}
