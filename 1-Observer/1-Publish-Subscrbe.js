const event = {
  clientList: [],
  listen: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn)  // 订阅的消息添加进缓存列表
  },
  trigger: function () {
    const key = Array.prototype.shift.call(arguments),
      fns = this.clientList[key]
    if (!fns || fns.length === 0) {  // 如果没有绑定对应的消息
      return false
    }
    for (let i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments)  // arguments 是 trigger 时带上的参数
    }
  },
  remove: function (key, fn) {
    const fns = this.clientList[key]
    if (!fns) {  // 如果 key 对应的消息没有被人订阅，则直接返回
      return false
    }
    if (!fn) {  // 如果没有传入具体的回调参数，表示需要取消 key 对应消息的所有订阅
      fns && (fn.length = 0)
    } else {
      for (let l = fns.length; l >= 0; l--) {
        let _fn = fns[l]
        if (_fn === fn) {
          fns.splice(l, 1)
        }
      }
    }
  }
}

const installEvent = (obj) => {
  for (let i in event) {
    obj[i] = event[i]
  }
}

const salesOffices = {}

installEvent(salesOffices)

const fn1 = (price) => {
  console.log('小明价格=' + price)
}

const fn2 = (price) => {
  console.log('小红价格=' + price)
}

salesOffices.listen('squareMeter88', fn1)  // 小明订阅消息
salesOffices.listen('squareMeter100', fn2)  // 小红订阅消息

salesOffices.remove('squareMeter88', fn1)
salesOffices.trigger('squareMeter88', 20000000)
salesOffices.trigger('squareMeter100', 30000000)