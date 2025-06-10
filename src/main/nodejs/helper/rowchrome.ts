const TASKBAR_HEIGHT = 60
const usedPositions = new Set<string>()
let currentIndex = 0

/**
 * Tính vị trí x, y dựa vào chỉ số, kích thước cửa sổ và số cột.
 */
export function calculatePosition(
  index: number,
  width: number,
  height: number,
  col: number
): { x: number; y: number } {
  return {
    x: (index % col) * width,
    y: Math.floor(index / col) * height
  }
}

/**
 * Lấy kích thước màn hình thật, trừ chiều cao taskbar.
 */
export async function getActualScreenResolution(): Promise<{
  width: number
  height: number
}> {
  // Thay bằng getResolution() thực tế nếu có
  const resolutionString = '1920x1080'
  const [widthStr, heightStr] = resolutionString.split('x')
  const width = parseInt(widthStr, 10)
  const height = parseInt(heightStr, 10)

  return {
    width,
    height: height - TASKBAR_HEIGHT
  }
}

/**
 * Tìm vị trí tiếp theo chưa dùng trong lưới.
 */
export function findNextAvailablePosition(
  width: number,
  height: number,
  col: number,
  row: number
): { x: number; y: number } {
  const maxSlots = col * row

  if (currentIndex >= maxSlots) {
    currentIndex = 0
    usedPositions.clear()
  }

  for (let i = 0; i < maxSlots; i++) {
    const indexToTry = (currentIndex + i) % maxSlots
    const { x, y } = calculatePosition(indexToTry, width, height, col)
    const key = `${x},${y}`
    if (!usedPositions.has(key)) {
      usedPositions.add(key)
      currentIndex = indexToTry + 1
      return { x, y }
    }
  }

  // Nếu không tìm được vị trí trống, reset lại
  currentIndex = 1
  usedPositions.clear()
  const { x, y } = calculatePosition(0, width, height, col)
  usedPositions.add(`${x},${y}`)
  return { x, y }
}
