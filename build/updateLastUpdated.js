const fs = require('fs')

const packageJsonPath = './package.json'
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
packageJson.lastUpdated = new Date().toLocaleDateString('vi')

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.info('lastUpdated đã được cập nhật thành:', packageJson.lastUpdated)
