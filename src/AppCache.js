export default class AppCache {
  memory = {}
  listeners = {}

  addItem(itemId, dataObj) {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 10)
    dataObj["validity"] = now.getTime()

    this.memory[itemId] = dataObj
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
    let dataObj

    if (this.memory[itemId]) {
      dataObj = this.memory[itemId]
    } else {
      dataObj = JSON.parse(sessionStorage.getItem(itemId))

      if (dataObj === null) {
        return false
      }
    }

    const now = new Date()

    if (now.getTime() > dataObj.validity) {
      return false
    }

    return true
  }

  getItem(itemId) {
    if (this.memory[itemId]) {
      return this.memory[itemId]
    } else {
      return JSON.parse(sessionStorage.getItem(itemId))
    }
  }
}