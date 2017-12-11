const Promise = require('./Promise')


function requstGet(url, data) {
  return requst(url, 'GET', data)
}

function requstGetOneParm(url) {
  return requst(url, 'GET')
}



function requstPost(url, data) {
  return requst(url, 'POST', data)
}


// 小程序上线需要https，这里使用服务器端脚本转发请求为https
function requst(url, method, data = {}) {
  return new Promise((resove, reject) => {
    wx.request({
      url: url,
      data: data,
      header: {},
      method: method.toUpperCase(), // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {

        resove(res.data)
      },
      fail: function (msg) {
        console.log('reqest error', msg)

        reject('fail')
      }
    })
  })
}

function requst(url, method) {
  return new Promise((resove, reject) => {
    wx.request({
      url: url,
      data: {},
      header: {},
      method: method.toUpperCase(), // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        resove(res.data)
      },
      fail: function (msg) {
        console.log('reqest error', msg)

        reject('fail')
      }
    })
  })
}
//将对象从数组中移除
function removeObjWithArr(_arr, _obj) {
  var length = _arr.length;
  for (var i = 0; i < length; i++) {
    if (JSON.stringify(_arr[i]) === JSON.stringify(_obj)) {
      if (i == 0) {
        _arr.shift(); //删除并返回数组的第一个元素
        return;
      }
      else if (i == length - 1) {
        _arr.pop();  //删除并返回数组的最后一个元素
        return;
      }
      else {
        _arr.splice(i, 1); //删除下标为i的元素
        return;
      }
    }
  }
}

// function loopPromise(parm){
//   var url
//   this.requstGetOneParm(url).then(res=>{
//     this.loopPromise()
//   })
// }




module.exports = {
  Promise,
  get: requstGet,
  post: requstPost,
  requst,
  getOneParm: requstGetOneParm,
  removeObjWithArr
}
