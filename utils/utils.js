const Promise = require('./Promise.js')

function requestGet(url, data) {
  return request(url, 'GET', data)
}

function request(url, method, data = {}) {

  return new Promise((resove, reject) => {
    wx.request({
      url: url,
      data: data,
      header: {},
      method: method,
      success: function () {
        resove(res.data)
      },
      fail: function (msg) {
        console.log(msg)
        reject('fail')
      }
    })
  }
  )
}















module.exports={
  get:requestGet
}