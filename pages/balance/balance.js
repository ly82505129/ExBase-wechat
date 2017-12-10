// pages/balance/balance.js
var app = getApp();
var mkList = app.marketList.getAllMarkList()
var mkBaseList = app.marketList.getAllMarketBase();
const num = require('../../utils/num.js');
var diff = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diffInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // var mkList = app.marketList.getAllMarkList().marketBase
    this.loopPromise(0);

  }
  ,

  loopPromise: function (x) {
    var url = app.globalData.exbaseBaseUrl + "GetTicker?base=" + mkBaseList[x] + "&market=MCOETH";
    var data = {}

    var diffUrl = app.globalData.exbaseBaseUrl + "GetExbaseInfo?market=MCOETH";
    app.util.getOneParm(diffUrl).then(res => {
      console.log(res)
      var diff_price = parseFloat((res.max_last_price[0] - res.min_last_price[0]).toFixed(8))
      console.log(parseFloat(diff_price.toFixed(8)))
      var diff_percent = num.toDecimal((diff_price / res.min_last_price[0]) * 100)
      console.log(diff_percent)

      var temp = {
        last_price: diff_price,
        change_percent: diff_percent,
        market: 'MCO/ETH'
      }


      this.setData({
        'diffInfo[0]': temp
      })
      var price_url = app.globalData.exbaseBaseUrl + "GetTicker?base=" + res.max_last_price[1] + "&market=ETHUSDT";
      return app.util.getOneParm(price_url)
    }).then(res => {
      console.log(res.last_price)
      var price_cny = parseFloat((this.data.diffInfo[0].last_price * res.last_price * mkList.finance).toFixed(8))
      this.setData({
        'diffInfo[0].price_cny': price_cny
      })
    })

    /*--循环获取每个交易所对应交易对的价格然后获取最大与最小值相减，并除以最小值获取差值的百分比
    app.util.get(url, data).then(res => {

      if (x < mkList.marketBase.length) {
        if (!res.error) {
          diff.push(Number(res.last_price))
        }
        x++
        this.loopPromise(x);
        if (x === mkList.marketBase.length) {
          console.log(diff)
          console.log(Math.max.apply(Math, diff))
          console.log(Math.min.apply(Math, diff))
          var diff_price = parseFloat((Math.max.apply(Math, diff) - Math.min.apply(Math, diff)).toFixed(8))
          console.log(parseFloat(diff_price.toFixed(8)))
          var dif_percent = num.toDecimal((diff_price / Math.min.apply(Math, diff)) * 100)
          var temp ={
            last_price: diff_price,
            change_percent: dif_percent,
            market:'MCO'
          }
          console.log(dif_percent)
          this.setData({
            'diffInfo[0]':temp
          })

        }
      }
    })
    --*/
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})