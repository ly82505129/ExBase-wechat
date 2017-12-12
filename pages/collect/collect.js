// pages/collect/collect.js
var app = getApp();
const num = require('../../utils/num.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var collectList = wx.getStorageSync('collectList')
    
    if (collectList) {
      this.loopPromise(0, collectList)
    }
  },

  loopPromise: function (times, array) {
    if (times < array.length){
      var collectBase = array[times].collectBase.substring(0, 1).toLowerCase() + array[times].collectBase.substring(1)
      var collectMarket = array[times].collectMarket.replace('/', '');
    var url = app.globalData.exbaseBaseUrl + "GetTicker?base=" + collectBase + "&market=" + collectMarket;
    app.util.getOneParm(url).then(res => {
      // var base = array[times].collectMarket.split("/");
      // console.log(base)
      // if (base[1] === "BTC") {
      //   res.price_cny = num.toDecimal(res.last_price * btcUsdt * mkList.finance)
      // } else if (base[1] === "ETH") {
      //   res.price_cny = num.toDecimal(res.last_price * ethUsdt * mkList.finance)
      // } else {
      //   res.price_cny = num.toDecimal(res.last_price * mkList.finance)
      // }
      
      res.market = array[times].collectMarket
      var key = "collectList[" + times + "]";
      times++
      this.setData({
        [key]: res
      })
      this.loopPromise(times, array)
    })
    }
  }

  ,
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

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  commitSearch:function(e){
    var inputVal=e.detail.value
;
  },
  commitSearch:function(e){
    var inputVal=e.detail.value
    var url = app.globalData.exbaseBaseUrl + "ExbaseQuery?q=" + inputVal;
    app.util.getOneParm(url).then(res=>{
      console.log(res)
      for(var i in res){
        console.log(i)
        res.i
      }
      
    })
  }
})