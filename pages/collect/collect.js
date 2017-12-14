// pages/collect/collect.js
import { DB } from "../../db/DB.js";
var marketList = new DB();
var mkList = marketList.getAllMarkList();
var app = getApp();
const num = require('../../utils/num.js');
const Promise = require('../../utils/Promise.js')
var tickerUrlBase = app.globalData.exbaseBaseUrl;
var saveBMPArray = []
var currentPrice

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
    var temp = [];
    var tempBase = [];
    saveBMPArray = []
    if (collectList) {
      this.loopPromise(0, collectList, temp)
    }

  },

  loopPromise: function (times, array, temp) {
    if (times < array.length) {
      var collectBase = array[times].collectBase.substring(0, 1).toLowerCase() + array[times].collectBase.substring(1)
      var collectMarket = array[times].collectMarket.replace('/', '');
      var url = app.globalData.exbaseBaseUrl + "GetTicker?base=" + collectBase + "&market=" + collectMarket;

      // tempBase.push(array[times].collectMarket.split("/")[1] + array[times].collectBase)
      // saveBMPArray
      var base = array[times].collectMarket.split("/");
      app.util.getOneParm(url).then(res => {

        console.log(base)
        if (base[1] === "BTC") {
          //   res.price_cny = num.toDecimal(res.last_price * btcUsdt * mkList.finance)

            this.getPrice(array[times].collectBase, "BTC")

        
          // this.getPrice(array[times].collectBase, "BTC").then(res => {
          //   console.log(currentPrice)

          // })

          app.util.getOneParm(tickerUrlBase + "GetTicker?base=" + array[times].collectBase + "&market=" + "BTCUSDT").then(function () {
            console.log("currentPrice1")
          })

        } else if (base[1] === "ETH") {
          //   res.price_cny = num.toDecimal(res.last_price * ethUsdt * mkList.finance)
          this.getPrice(array[times].collectBase, "ETH")
        } else {
          //   res.price_cny = num.toDecimal(res.last_price * mkList.finance)
        }
        temp.push(res)
        res.market = array[times].collectMarket
        var key = "collectList[" + times + "]";
        times++
        this.setData({
          collectList: temp
        })
        this.loopPromise(times, array, temp)
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
  getPrice: function (base, market) {
    var that = this
    var compare=[]
    return new Promise(function (resolve, reject) {
      wx.request({
        url: tickerUrlBase + "GetTicker?base=" + base + "&market=" + market + "USDT",
        method: 'GET',
        success: function (res) {
          currentPrice = res.data.last_price * mkList.finance
          var saveBMPObj = {
            base: base,
            market: market,
            price: currentPrice,
          }
          
          for (var i = 0; i < saveBMPArray;i++){
            compare.push(saveBMPArray[i].base + saveBMPArray[i].base)
          }
          console.log(compare)
          
          if (JSON.stringify(saveBMPArray).indexOf(compare)===-1){
          saveBMPArray.push(saveBMPObj)
          }
          that.setData({
            price: saveBMPArray
          })
          
          console.log(saveBMPArray)
          resolve();
        }
      })
    })
  }
  ,



  //搜索输入框相关事件
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
  commitSearch: function (e) {
    var inputVal = e.detail.value
      ;
  },
  commitSearch: function (e) {
    var inputVal = e.detail.value
    var url = app.globalData.exbaseBaseUrl + "ExbaseQuery?q=" + inputVal;
    var temp = [];
    app.util.getOneParm(url).then(res => {
      console.log(res)
      for (var i in res) {
        for (var j = 0; j < res[i].length; j++) {
          console.log(i)
          for (var k in res[i][j]) {
            console.log(res[i][j][k])
            res[i][j][k].market = i
            res[i][j][k].base = k
            temp.push(res[i][j][k])
          }
        }
      }
      this.setData({
        searchReslut: temp
      })

    })
  }
})