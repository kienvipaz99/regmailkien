import { logger, PATH_UI } from '@main/core/nodejs'
import { delay } from '@vitechgroup/mkt-key-client'
import { exec } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import { DOMParser } from 'xmldom'
import fs from 'node:fs'
import { promisify } from 'util'
import * as xpath from 'xpath'
const execAsync = promisify(exec)
export const CommanAdb = async (
  deviceId: string,
  command: string
): Promise<{ stdout: string; stderr?: string } | null> => {
  try {
    const fullCommand = `adb -s ${deviceId} ${command}`
    const { stdout, stderr } = await execAsync(fullCommand)
    return { stdout, stderr }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`ADB command failed [${deviceId}]: ${errorMessage}`)
    return null
  }
}
export class Point {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  // Static method to represent an empty point
  static empty(): Point {
    return new Point()
  }

  // Method to check if a point is empty
  isEmpty(): boolean {
    return this.x === 0 && this.y === 0
  }
}
class BoundingBox {
  topLeft: Point
  bottomRight: Point

  constructor(topLeft: Point = new Point(), bottomRight: Point = new Point()) {
    this.topLeft = topLeft
    this.bottomRight = bottomRight
  }

  // Method to find the center point of the bounding box
  findCenterPoint(): Point {
    const centerX = Math.floor((this.topLeft.x + this.bottomRight.x) / 2)
    const centerY = Math.floor((this.topLeft.y + this.bottomRight.y) / 2)
    return new Point(centerX, centerY)
  }
}
export const dumpXml = async (deviceId: string, saveDir?: string): Promise<string> => {
  try {
    const pathfile = saveDir + `/${deviceId}.xml`

    // Ghi file rỗng nếu chưa có
    if (!existsSync(pathfile)) {
      writeFileSync(pathfile, '')
    }
    await CommanAdb(deviceId, `shell "uiautomator dump /sdcard/${deviceId}.xml"`)
    await execAsync(`adb -s ${deviceId} pull /sdcard/${deviceId}.xml "${pathfile}"`)
    return existsSync(pathfile) ? pathfile : ''
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`❌ dumpXml failed for device ${deviceId}: ${errorMessage}`)
    return ''
  }
}
export async function findNodeByXPaths(
  deviceId: string,
  xpathExpression: string
): Promise<Node | null> {
  const fileUIDump = await dumpXml(deviceId, PATH_UI)
  try {
    const xmlData = fs.readFileSync(fileUIDump, 'utf-8')
    // Parse the XML content
    const doc = new DOMParser().parseFromString(xmlData, 'text/xml')
    const node = xpath.select1(xpathExpression, doc) as Node | null
    return node
  } catch (error) {
    console.error('Error while finding node by XPath:', error)
  }

  return null
}
export async function detectNodeByXPath(
  ldId: string,
  xpath: string,
  timeOut: number
): Promise<boolean> {
  const startTime = Date.now()
  const timeoutMilliseconds = timeOut * 1000

  while (Date.now() - startTime < timeoutMilliseconds) {
    try {
      const nodeFound = await findNodeByXPaths(ldId, xpath)
      if (nodeFound) {
        return true
      }
      await delay(3000)
    } catch (error) {
      console.error('Error during node detection:', error)
      return false
    }
  }
  return false
}
export async function clickDetectNodeByXPath(
  ldId: string,
  xpath: string,
  timeOut: number
): Promise<boolean> {
  try {
    for (let i = 0; i < timeOut; i++) {
      const nodeFound = await findNodeByXPaths(ldId, xpath)
      if (nodeFound) {
        const point = await findPointByNode(nodeFound)
        await clickByPoint(ldId, point)
        return true
      }
      await delay(3000)
    }
    return false
  } catch (error) {
    console.error('Error during click detection:', error)
    return false
  }
}
export async function findPointByNode(node: Node | null): Promise<Point> {
  const boundsAttr = (node as Element).getAttribute('bounds')
  if (!boundsAttr) {
    return Point.empty()
  }

  const coordinates = extractCoordinates(boundsAttr)
  if (coordinates) {
    const [left, top, right, bottom] = coordinates
    const boundingBox = new BoundingBox(new Point(left, top), new Point(right, bottom))
    return boundingBox.findCenterPoint()
  } else {
    return Point.empty()
  }
}

function extractCoordinates(bounds: string): [number, number, number, number] | null {
  const regex = /\[(\d+),(\d+)\]\[(\d+),(\d+)\]/
  const match = bounds.match(regex)

  if (match) {
    const left = parseInt(match[1], 10)
    const top = parseInt(match[2], 10)
    const right = parseInt(match[3], 10)
    const bottom = parseInt(match[4], 10)
    return [left, top, right, bottom]
  }

  return null
}
export async function clickByPoint(deviceId: string, point: Point): Promise<void> {
  if (!point.isEmpty()) {
    const cmdCommand = `shell input tap ${point.x} ${point.y}`
    await CommanAdb(deviceId, cmdCommand)
  } else {
    console.log('Point is empty. No tap executed.')
  }
}
