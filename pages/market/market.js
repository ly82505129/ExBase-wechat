import { DB } from "../../db/DB.js";
const num = require('../../utils/num.js');
var app = getApp();
var marketList = new DB();
var market = [];
var mkList = marketList.getAllMarkList();
var mkBaseList = marketList.getAllMarketBase();
var timer = null;
var baseListUrl = app.globalData.exbaseBaseUrl + "GetExbaseInfo";
var marketUrl = app.globalData.exbaseBaseUrl + "GetTicker?base=" + marketList.getAllMarketBase()[0];

var collectStorageList;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketInfo: [],

    listShow: [
      { show: true },
    ],
    marketBaseTab: 0

    // marketBase:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    app.getFinance().then(this.getBaseListLoadMarket());
    
    // this.setData({
    //   market: marketList.getAllMarkList().market
    // })
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
    var storageBase = wx.getStorageSync('storageBase')
    var storageBaseCurrency = wx.getStorageSync('storageBaseCurrency')
    var marketBaseUrlParm = '';
    var marketBaseTab = this.data.marketBaseTab;
    if (!storageBase) {

    }

    if (this.data.marketBase) {
      marketBaseUrlParm = this.data.marketBase[marketBaseTab].marketBase.substring(0, 1).toLowerCase() + this.data.marketBase[marketBaseTab].marketBase.substring(1)

    }
    else {
      marketBaseUrlParm = marketList.getAllMarketBase()[0]
    }

    this.getMarket(app.globalData.exbaseBaseUrl + "GetTicker?base=" + marketBaseUrlParm);
    // var marketUrl = app.globalData.exbaseBaseUrl + "GetTicker?base=" + mkList.marketBase[0].marketBase;
    // var that=this;
    // timer=setInterval(function(){
    //   that.getMarket(marketUrl)
    // },2000)
  },
  //初始化时获取基础交易所列表并传递
  getBaseListLoadMarket: function () {

    // for (var i = 0; i < mkList.marketBase.length;i++){
    //   mkList.marketBase[i].selected=true
    //   console.log('这里打印marketbase' + kList.marketBase[i])
    // }
    // wx.getStorageInfoSync('marketList')
    // console.log(wx.getStorageInfoSync('marketList'))
    // console.log(wx.getStorageSync('marketList').marketBase)
    var that = this
    var dataMarketBaseTemp = [];
    if (!wx.getStorageSync('marketBase')) {
      app.util.getOneParm(baseListUrl).then(res => {
        wx.setStorageSync('marketBase', res.base);
        res.base.forEach(
          function (i, b) {
            var mlist = {};
            // i.marketBase = i.marketBase.substring(0,1).toUpperCase() + i.marketBase.substring(1)
            // i = i.substring(0,1).toUpperCase() + i.substring(1)

            mlist.marketBase = i.substring(0, 1).toUpperCase() + i.substring(1);
            mlist.selected = true;
            mlist.mk_id = b;
            dataMarketBaseTemp[b] = mlist;
          }
        )
        this.setData({
          marketBase: dataMarketBaseTemp,
        })
        this.getMarket(app.globalData.exbaseBaseUrl + "GetTicker?base=" + marketList.getAllMarketBase()[0]);
      })
    }
    else {
      var mkBaseList = marketList.getAllMarketBase();
      for (var i = 0; i < mkBaseList.length; i++) {
        var mlist = {};
        // i.marketBase = i.marketBase.substring(0,1).toUpperCase() + i.marketBase.substring(1)
        // i = i.substring(0,1).toUpperCase() + i.substring(1)
        mlist.marketBase = mkBaseList[i].substring(0, 1).toUpperCase() + mkBaseList[i].substring(1);
        mlist.selected = true;
        mlist.mk_id = i;
        dataMarketBaseTemp[i] = mlist;
      }
      this.setData({
        marketBase: dataMarketBaseTemp,
      })
      // var params = {
      //   market: mkList.market[i],
      //   base: mkList.marketBase
      // }
      this.getMarket(app.globalData.exbaseBaseUrl + "GetTicker?base=" + marketList.getAllMarketBase()[0]);

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer)
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
    // this.getMarket(marketUrl);
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


  getMarket: function (url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: 'json',
      success: function (res) {
        that.loadMarketData(res.data);
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

  loadMarketData: function (res) {
    // var key = "marketInfo[" + i + "]";
    /*1.修改res中的对象，将change_percent换成百分比并保留两位小叔，
      2.往res中增加对象，将market交易对放入到res中
    */
    // var  market=[res];
    var base;
    var baseCurrencyArray = []
    var temp = []
    var collectList = wx.getStorageSync('collectList')
    for (var i in res) {
      var btcUsdt = res["BTC_USDT"].last_price
      var ethUsdt = res["ETH_USDT"].last_price
      res[i].change_percent = num.toDecimal(res[i].change_percent);
      res[i].market = i.replace('_', '/');

      var baseName = this.getCurrentBase(this.data.marketBaseTab)
      for (var j = 0; j < collectList.length; j++) {
        var collectMarketName = collectList[j].collectMarket
        var resMarketName = res[i].market

        var collectBaseName = collectList[j].collectBase
        if ((baseName === collectBaseName) && (collectMarketName === resMarketName)) {
            res[i].collectStatus = true;
            break;
        }
        else {
          res[i].collectStatus = false;
        }
      }

      base = i.split("_");
      //判断基础货币对是否与baseCurrencyArray重复，若不重复则将基础货币追加进数组
      if (baseCurrencyArray.indexOf(base[1]) == -1) {
        baseCurrencyArray.push(base[1])
      }

      //将人民币价格增加至res数组中
      if (base[1] === "BTC") {
        res[i].price_cny = num.toDecimal(res[i].last_price * btcUsdt * mkList.finance)
      } else if (base[1] === "ETH") {
        res[i].price_cny = num.toDecimal(res[i].last_price * ethUsdt * mkList.finance)
      } else {
        res[i].price_cny = num.toDecimal(res[i].last_price * mkList.finance)
      }
    }
    for (var i = 0; i < baseCurrencyArray.length; i++) {
      var marketPrice = []
      var show
      for (var j in res) {
        base = j.split("_");
        if (baseCurrencyArray[i] === base[1]) {
          marketPrice.push(res[j])

        }
      }
      if (i === 0) {
        show = true
      }
      else {
        show = false
      }

      temp[i] = {
        baseCurrencyArray: baseCurrencyArray[i],
        marketPrice: marketPrice,
        show: show
      }


      // temp[baseCurrencyArray[baseCurrencyArray.indexOf(base[1])]] = {
      //   baseCurrencyArray: baseCurrencyArray[baseCurrencyArray.indexOf(base[1])],
      //   marketPrice: marketPrice.push(res[i])
      // }

    }

    // res.change_percent = num.toDecimal(res.change_percent * 100) + "%";
    // res.market = params.market;
    this.setData({
      marketInfo: temp,
      // temp: temp

    });
    // return res;
    // var length=market.length
    // this.market[length]=res;
    // market.push(res);

  },
  showContent: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var key = "marketInfo[" + index + "].show";
    var val = this.data.marketInfo[index].show;
    for (var i = 0; i < this.data.marketInfo.length; i++) {
      if (this.data.marketInfo[i].show === true) {
        // this.data.marketInfo[i]=false
        var show = "marketInfo[" + i + "].show"
        var tem = false
        this.setData({
          [show]: tem
        })
      }
    }
    this.setData({
      [key]: !val
    })

  },    // 切换当前选择的分类
  changeMarketBase(event) {
    var chid = event.target.dataset.id
    // 获取ccurrentTab.没有切换分类
    if (this.data.marketBaseTab === chid) {
      return false
    }
    this.setData({ marketBaseTab: chid })
    var parm = (this.data.marketBase[chid].marketBase.substring(0, 1).toLowerCase() + this.data.marketBase[chid].marketBase.substring(1))
    var marketUrl = app.globalData.exbaseBaseUrl + "GetTicker?base=" + parm;
    this.getMarket(marketUrl);
  }
  /**
  * 接口调用成功处理
 
   successFun: function (res, selfObj) {
     var a = res.change_percent * 100;
     res.change_percent = num.toDecimal(a) + "%";
     res.market = mkList.market[i]
     console.log(res);
     market.push(res);
     console.log("这里是打印successFUn函数内的market值" + market);
     selfObj.setData({
       marketInfo: market,
     })
   },
 
    * 接口调用失败处理
    
   failFun: function (res, selfObj) {
     console.log('failFun', res)
   }*/
  ,

  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间  
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件
  touchMove: function (e) {
    var touchMove = e.touches[0].pageX;
    console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向左滑动  
    if (touchMove - touchDot <= -40 && time < 10) {
      if (tmpFlag && nth < nthMax) { //每次移动中且滑动时不超过最大值 只执行一次
        var tmp = this.data.menu.map(function (arr, index) {
          tmpFlag = false;
          if (arr.active) { // 当前的状态更改
            nth = index;
            ++nth;
            arr.active = nth > nthMax ? true : false;
          }
          if (nth == index) { // 下一个的状态更改
            arr.active = true;
            name = arr.value;
          }
          return arr;
        })
        this.getNews(name); // 获取新闻列表
        this.setData({ menu: tmp }); // 更新菜单
      }
    }
    // 向右滑动
    if (touchMove - touchDot >= 40 && time < 10) {
      if (tmpFlag && nth > 0) {
        nth = --nth < 0 ? 0 : nth;
        var tmp = this.data.menu.map(function (arr, index) {
          tmpFlag = false;
          arr.active = false;
          // 上一个的状态更改
          if (nth == index) {
            arr.active = true;
            name = arr.value;
          }
          return arr;
        })
        this.getNews(name); // 获取新闻列表
        this.setData({ menu: tmp }); // 更新菜单
      }
    }
    // touchDot = touchMove; //每移动一次把上一次的点作为原点（好像没啥用）
  },
  // 触摸结束事件
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
    tmpFlag = true; // 回复滑动事件
  }
  ,
  collect: function (event) {
    collectStorageList = wx.getStorageSync('collectList')
    if (!collectStorageList) {
      collectStorageList = [];
    }
    // console.log(collectStorageList)
    var marketBaseTab = this.data.marketBaseTab;
    // console.log(this.getCurrentBase(marketBaseTab))
    var collectStorageTemp = {
      collectBase: this.getCurrentBase(marketBaseTab),
      collectMarket: event.target.dataset.baseMarket
    }
    if (JSON.stringify(collectStorageList).indexOf(JSON.stringify(collectStorageTemp)) === -1) {
      collectStorageList.push(collectStorageTemp)

    } else {

      app.util.removeObjWithArr(collectStorageList, collectStorageTemp)

    }
    // if (){
    for (var i = 0; i < this.data.marketInfo.length; i++) {
      for (var j = 0; j < this.data.marketInfo[i].marketPrice.length; j++) {
        if (this.data.marketInfo[i].marketPrice[j].market === event.target.dataset.baseMarket) {
          var key = "marketInfo[" + i + "].marketPrice[" + j + "].collectStatus"
          this.setData({
            [key]: true
          })
        }
      }
    }
    // }
    wx.setStorageSync('collectList', collectStorageList)

  },
  getCurrentBase: function (num) {

    var marketBase = this.data.marketBase
    for (var i = 0; i < marketBase.length; i++) {
      if (marketBase[i].mk_id === num) {
        return marketBase[i].marketBase
      }

    }

  }
})