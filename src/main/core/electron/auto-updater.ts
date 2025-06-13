// import {
//   makeSyncDataHash,
//   PrefixKeySync,
//   SocketEvent,
//   SocketEventKey,
//   SyncDataSocketClient
// } from '@vitechgroup/mkt-key-client'
// import { autoUpdater } from 'electron-updater'

// /**
//  * @deprecated
//  *
//  * autoUpdate by MKT Client
//  * since 20/02/2025
//  **/
// export const checkUpdate = (): void => {
//   const socketSync = SyncDataSocketClient.get()

//   // autoUpdater.forceDevUpdateConfig = true
//   autoUpdater.autoDownload = false
//   autoUpdater.logger = null

//   autoUpdater.on('checking-for-update', () => console.log('checking-for-update'))

//   autoUpdater.on('update-available', (info) => {
//     const sendData = JSON.stringify(info)
//     socketSync.emit(SocketEventKey.SYNC_DATA, {
//       entity: 'product',
//       event: SocketEvent.uProduct,
//       from: PrefixKeySync.care,
//       hash: makeSyncDataHash(sendData),
//       data: sendData
//     })
//   })

//   autoUpdater.checkForUpdatesAndNotify()
// }
