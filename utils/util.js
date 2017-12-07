const Promise = require('./Promise')


function requstGet(url,data){
  return requst(url,'GET',data)
}

function requstGetOneParm(url) {
  return requst(url, 'GET', data)
}



function requstPost(url,data){
  return requst(url,'POST',data)
}


// 小程序上线需要https，这里使用服务器端脚本转发请求为https
function requst(url,method,data = {}){
  return new Promise((resove,reject) => {
    wx.request({
      url: url,
      data: data,
      header: {},
      method: method.toUpperCase(), // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res){
        
        resove(res.data)
      },
      fail: function(msg) {
        console.log('reqest error',msg)
        
        reject('fail')
      }
    })
  })
}





module.exports = {
  Promise,
  get:requstGet,
  post:requstPost,
  requst,
  getOneParm: requstGetOneParm
}
