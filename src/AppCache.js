export default class AppCache {
  listeners = {}

  addItem(itemId, dataObj) {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 10)
    dataObj["validity"] = now.getTime()

    const dataStr = JSON.stringify(dataObj)
    sessionStorage.setItem(itemId, dataStr)

    this.invokeListeners(itemId, dataObj)
  }

  addListener(itemId, callback) {
    if (!Array.isArray(this.listeners[itemId])) {
      this.listeners[itemId] = []
    }

    this.listeners[itemId].push(callback)
  }

  invokeListeners(itemId, dataObj) {
    const callbacks = this.listeners[itemId]

    if (Array.isArray(callbacks)) {
      callbacks.forEach(callback => callback(dataObj))
    }
  }

  removeListener(itemId, callback) {
    const callbacks = this.listeners[itemId]

    if (Array.isArray(callbacks)) {
      callbacks.splice(callbacks.indexOf(callback), 1)
    }
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
    return JSON.parse(dataStr)
  }
}