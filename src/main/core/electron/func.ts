import { IKeyMessageWorker } from '@preload/types'
import { app, BrowserWindow, dialog } from 'electron'

export const mainWindow = (): BrowserWindow => BrowserWindow.getAllWindows()[0]!

export const sendMessageRenderer = <T>(message: IKeyMessageWorker, data?: T): void => {
  mainWindow()?.webContents?.send(message, data)
}

export const dialogAuthError = (): void => {
  dialog
    .showMessageBox(mainWindow(), {
      type: 'error',
      title: 'Lỗi xác thực!',
      message:
        'Phần mềm xác thực mã kích hoạt của bạn, không thành công!\r\nHãy kiểm tra lại kết nối mạng!',
      noLink: true,
      buttons: ['Quit']
    })
    .then((confirm) => {
      if (confirm.response === 0) {
        app.exit()
      }
    })

  setTimeout(() => {
    app.exit()
  }, 15000)
}
