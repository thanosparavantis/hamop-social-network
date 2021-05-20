export default class AppCache {
  addItem(itemId, dataObj, cacheTime = "small") {
    const now = new Date()

    if (cacheTime === "medium") {
      now.setHours(now.getHours() + 1)
    } else if (cacheTime === "large") {
      now.setHours(now.getHours() + 24)
    } else {
      now.setMinutes(now.getMinutes() + 5)
    }

    dataObj["validity"] = now.getTime()

    const dataStr = JSON.stringify(dataObj)
    console.debug(`Adding to cache: ${dataStr}`)

    localStorage.setItem(itemId, dataStr)
  }

  isCached(itemId) {
    const dataStr = localStorage.getItem(itemId)
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
    const dataStr = localStorage.getItem(itemId)
    const dataObj = JSON.parse(dataStr)

    console.debug(`Getting from cache: ${dataStr}`)

    return dataObj
  }
}