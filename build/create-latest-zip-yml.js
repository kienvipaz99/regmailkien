/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const yaml = require('write-yaml')

const packageJsonPath = './package.json'
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

// Đường dẫn đến file zip
const zipName = `${packageJson.productName}-${packageJson.version}-win.zip`
const zipFilePath = path.join(__dirname, '../dist', zipName)

// Tạo hàm tính hash SHA512
async function hashFile(file, algorithm = 'sha512', encoding = 'base64', options) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm)
    const stream = fs.createReadStream(file, {
      highWaterMark: 1024 * 1024, // Đọc theo block 1MB để tăng tốc độ
      ...options
    })

    stream.on('error', (err) => {
      console.error(`❌ Lỗi khi đọc file: ${err.message}`)
      stream.close() // Đảm bảo đóng stream khi lỗi
      reject(err)
    })

    hash.on('error', (err) => {
      console.error(`❌ Lỗi khi hash file: ${err.message}`)
      stream.close()
      reject(err)
    })

    stream.on('end', () => {
      hash.end()
      const result = hash.digest(encoding) // Sử dụng digest thay vì read
      stream.close() // Đảm bảo stream được đóng
      console.warn('✅ Hash hoàn tất!')
      resolve(result)
    })

    stream.pipe(hash)
  })
}

// Tạo file latest.yml
async function createLatestYml() {
  const hash = await hashFile(zipFilePath)
  const stats = fs.statSync(zipFilePath)

  const data = {
    version: packageJson.version,
    files: [
      {
        url: path.basename(zipFilePath),
        sha512: hash,
        size: stats.size
      }
    ],
    path: path.basename(zipFilePath),
    sha512: hash,
    releaseDate: new Date().toISOString()
  }
  console.log('🚀 ~ createLatestYml ~ data:', data)

  yaml.sync(path.join(__dirname, '../dist', 'latest.yml'), data, { lineWidth: -1 })
}

createLatestYml()
  .then(() => console.log('latest.yml created'))
  .catch(console.error)
