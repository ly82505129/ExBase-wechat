import { DB } from "./db/DB.js";
const request = require('./utils/request.js')
const utils = require('./utils/util.js')
var marketList = new DB();
var dataObj = require("data/data.js")


App({
  request: request,
  marketList: marketList,
  utils,

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

    var storageData = wx.getStorageSync('marketList');
    if (!storageData) {

      this.getMarketBase();
      this.getFinance();

    }
    


  },

  getMarketBase: function () {
    var url = this.globalData.exbaseBaseUrl + "/GetExbaseInfo";
    wx.request({
      url: url,
      success: function (res) {
        dataObj.marketList.marketBase = res.data.base;
        wx.clearStorageSync();
        wx.setStorageSync('marketList', dataObj.marketList);
        // if (getCurrentPages().length != 0) {
        //   getCurrentPages()[getCurrentPages().length - 1].onLoad()
        // }
        console.log("这里打印缓存" + wx.getStorageSync('marketList'))
      }
    })
  },

  getFinance:function(){
    var url = "https://op.juhe.cn/onebox/exchange/query?key=ebb4522dcc134fabac4e8b29c77eac47";
    wx.request({
      url: url,
      success:function(res){
        console.log(res.data.result.list[0][5]/100)
        dataObj.marketList.finance = res.data.result.list[0][5] /100;
        wx.setStorageSync('marketList', dataObj.marketList)
        if (getCurrentPages().length != 0) {
          getCurrentPages()[getCurrentPages().length - 1].onLoad()
        }
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },

  globalData: {
    exbaseBaseUrl: "http://45.77.25.254/api_v1/"
  }
})




