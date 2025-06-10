import { CommanAdb } from './commandadb'

const tapPoints = [
  { x: 540, y: 1000 },
  { x: 540, y: 1100 },
  { x: 540, y: 1200 },
  { x: 540, y: 1400 },
  { x: 540, y: 1500 }
]

// Hàm random từ mảng
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function randomAction(deviceId: string): Promise<void> {
  const randomChoice = Math.random()

  if (randomChoice < 0.7) {
    // 70% xác suất: click vào 1 điểm ngẫu nhiên
    const point = randomElement(tapPoints)
    console.log(`👉 Click tại (${point.x}, ${point.y})`)
    await CommanAdb(deviceId, `shell input tap ${point.x} ${point.y}`)
  } else {
    // 30% xác suất: vuốt rồi click
    console.log(`👉 Vuốt từ (540, 1400) đến (500, 1000)`)
    await CommanAdb(deviceId, `shell input swipe 540 1400 540 1000 500`)
    const point = randomElement(tapPoints)
    console.log(`👉 Sau vuốt, click tại (${point.x}, ${point.y})`)
    await CommanAdb(deviceId, `shell input tap ${point.x} ${point.y}`)
  }
}
const tapPointsGender = [
  { x: 540, y: 1100 },
  { x: 540, y: 1150 }
]
export async function clickGender(deviceId: string): Promise<void> {
  const point = randomElement(tapPointsGender)
  await CommanAdb(deviceId, `shell input tap ${point.x} ${point.y}`)
}
export function generateRandomPassword(length = 12): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?'

  const all = upper + lower + digits + symbols

  let password = ''
  password += upper[Math.floor(Math.random() * upper.length)]
  password += lower[Math.floor(Math.random() * lower.length)]
  password += digits[Math.floor(Math.random() * digits.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }

  return shuffle(password)
}

// Shuffle chuỗi ký tự để ngẫu nhiên hóa vị trí
function shuffle(str: string): string {
  return str
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
}
function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export function generateRandomEmail(firstName: string, lastName: string): string {
  const specialChars = '0123456789'
  const randomSuffixLength = Math.floor(Math.random() * 2) + 5 // tạo 5–6 ký tự ngẫu nhiên
  let randomSuffix = ''

  for (let i = 0; i < randomSuffixLength; i++) {
    randomSuffix += specialChars.charAt(Math.floor(Math.random() * specialChars.length))
  }
  const cleanFirst = removeVietnameseTones(firstName).toLowerCase().replace(/\s+/g, '')
  const cleanLast = removeVietnameseTones(lastName).toLowerCase().replace(/\s+/g, '')
  const username = `${cleanFirst}${cleanLast}${randomSuffix}`

  return username
}

export function randomVietnameseName(nameaccount: string): string {
  const nameList = nameaccount
    .split('\n')
    .map((name) => name.trim())
    .filter((name) => name.length > 0)
  const randomIndex = Math.floor(Math.random() * nameList.length)
  return nameList[randomIndex]
}
