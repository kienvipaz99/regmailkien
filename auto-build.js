const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)

const YARN_UPGRADE_RETRIES = 3

async function executeCommand(command, maxRetries = 0) {
  let attempts = 0
  while (attempts <= maxRetries) {
    try {
      const { stdout, stderr } = await execPromise(command)
      if (stdout) console.log(`Kết quả: ${stdout}`)
      if (stderr) console.error(`Cảnh báo: ${stderr}`)
      return true
    } catch (error) {
      attempts++
      if (attempts > maxRetries) {
        throw error
      }
      console.log(`Thử lại "${command}" lần ${attempts}/${maxRetries} sau 3s...`)
      if (command.includes('yarn upgrade') && attempts <= maxRetries) {
        console.log(`[${command}] Chạy yarn trước khi retry...`)
        try {
          await execPromise('yarn')
          console.log(`[${command}] Chạy yarn thành công!`)
        } catch (yarnError) {
          console.error(`[${command}] Lỗi khi chạy yarn:`, yarnError.message)
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }
}

async function runCommands() {
  try {
    console.log('Bắt đầu pull code từ GitHub...')
    await executeCommand('git pull')
    console.log('Pull code thành công!')

    console.log('Chạy yarn upgrade...')
    await executeCommand(
      'yarn upgrade -r @vitechgroup/* --network-timeout 1000000000',
      YARN_UPGRADE_RETRIES
    )
    console.log('Yarn upgrade hoàn tất!')

    console.log('Chạy npm rebuild...')
    await executeCommand('npm rebuild')
    console.log('Npm rebuild hoàn tất!')

    console.log('Chạy yarn build:win:zip...')
    await executeCommand('yarn build:win:zip')
    console.log('Build hoàn tất!')
  } catch (error) {
    console.error('Quá trình thất bại!')
    console.error('Chi tiết lỗi:', error.message)
    process.exit(1)
  }
}

runCommands()
