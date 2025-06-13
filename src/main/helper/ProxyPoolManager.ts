// src/utils/ProxyPoolManager.ts
export class ProxyPoolManager {
  private static instance: ProxyPoolManager
  private availableKeys: string[] = []
  private waitingResolvers: ((key: string) => void)[] = []

  public static getInstance(): ProxyPoolManager {
    if (!ProxyPoolManager.instance) {
      ProxyPoolManager.instance = new ProxyPoolManager()
    }
    return ProxyPoolManager.instance
  }

  public initialize(keys: string[]): void {
    this.availableKeys = [...keys]
  }

  public async acquireKey(): Promise<string> {
    if (this.availableKeys.length > 0) {
      return this.availableKeys.shift()!
    }

    return new Promise((resolve) => {
      this.waitingResolvers.push(resolve)
    })
  }

  public releaseKey(key: string): void {
    if (this.waitingResolvers.length > 0) {
      const resolver = this.waitingResolvers.shift()
      resolver?.(key)
    } else {
      this.availableKeys.push(key)
    }
  }
}
