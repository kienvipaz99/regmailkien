import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { CommonEntity } from './CommonEntity'

@Entity('map')
@Index(['job_id', 'keyword', 'store_name', 'address'], {
  unique: true
})
export class Maps extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column('nvarchar')
  job_id!: string

  @Column('nvarchar')
  job_detail_id!: string

  @Column('nvarchar')
  keyword!: string

  @Column('nvarchar')
  store_name: string

  @Column('nvarchar')
  address: string

  @Column('nvarchar', { nullable: true, default: null })
  phone: string | null

  @Column('nvarchar', { default: null, nullable: true })
  website: string | null

  @Column('nvarchar', { default: null, nullable: true })
  open_time: string | null

  @Column('nvarchar', { default: null, nullable: true })
  rating: string | null

  @Column('nvarchar', { default: null, nullable: true })
  avatar: string | null

  @Column('nvarchar', { default: null, nullable: true })
  gps: string | null
}
