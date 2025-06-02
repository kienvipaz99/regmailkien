import { DB_FILE, DB_HISTORY_FILE, DB_SCAN_FILE } from '@main/core/nodejs'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Account, AccountGmail, Category, Post } from './entities'
import { Maps } from './entities/MapsEntity'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: DB_FILE,
  synchronize: true,
  logging: false,
  entities: [Category, Account, Post, AccountGmail],
  enableWAL: true
})

export const AppDataScanSource = new DataSource({
  type: 'better-sqlite3',
  database: DB_SCAN_FILE,
  synchronize: true,
  logging: false,
  entities: [Maps],
  enableWAL: true
})

export const AppDataHistorySource = new DataSource({
  type: 'better-sqlite3',
  database: DB_HISTORY_FILE,
  synchronize: true,
  logging: false,
  entities: [],
  enableWAL: true
})

export const categoryRepo = (): Repository<Category> => AppDataSource.getRepository(Category)
export const categoryQB = (): SelectQueryBuilder<Category> =>
  categoryRepo().createQueryBuilder('category')

export const accountRepo = (): Repository<Account> => AppDataSource.getRepository(Account)
export const accountQB = (): SelectQueryBuilder<Account> =>
  accountRepo().createQueryBuilder('account')

export const postRepo = (): Repository<Post> => AppDataSource.getRepository(Post)
export const postQB = (): SelectQueryBuilder<Post> => postRepo().createQueryBuilder('post')

export const gMapRepo = (): Repository<Maps> => AppDataScanSource.getRepository(Maps)
export const gMapQB = (): SelectQueryBuilder<Maps> => gMapRepo().createQueryBuilder('map')

export const accountGmailRepo = (): Repository<AccountGmail> =>
  AppDataSource.getRepository(AccountGmail)
export const accountGmailQB = (): SelectQueryBuilder<AccountGmail> =>
  accountGmailRepo().createQueryBuilder('account_gmail')
