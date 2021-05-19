export default class AppCache {
  addItem(itemId, dataObj) {
    console.debug(`[AppCache: ${itemId}] Adding item to cache.`)
    sessionStorage.setItem(itemId, JSON.stringify(dataObj))
  }

  isCached(itemId) {
    return this.getItem(itemId) !== null
  }

  getItem(itemId) {
    console.debug(`[AppCache: ${itemId}] Retrieving cached item.`)
    return JSON.parse(sessionStorage.getItem(itemId))
  }
}