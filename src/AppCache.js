export default class AppCache {
  addItem(itemId, dataObj) {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 10)
    dataObj["validity"] = now.getTime()

    const dataStr = JSON.stringify(dataObj)
    console.debug(`Adding to cache: ${dataStr}`)

    sessionStorage.setItem(itemId, dataStr)
  }

  isCached(itemId) {
    const dataStr = sessionStorage.getItem(itemId)
    const dataObj = JSON.parse(dataStr)

    if (dataObj === null) {
      return false
    }

    const now = new Date()

    if (now.getTime() > dataObj.validity) {
      return false
    }

    return true
  }

  getItem(itemId) {
    const dataStr = sessionStorage.getItem(itemId)
    const dataObj = JSON.parse(dataStr)

    console.debug(`Getting from cache: ${dataStr}`)

    return dataObj
  }
}