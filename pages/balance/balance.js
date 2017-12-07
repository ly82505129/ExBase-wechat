// pages/balance/balance.js
var app = getApp();
var mkList = app.marketList.getAllMarkList()
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
    var url = app.globalData.exbaseBaseUrl + "GetTicker?base=" + mkList.marketBase[x] + "&market=MCOETH";
    var data = {}

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