class DB {
  constructor(market) {
    this.storageKeyName = 'marketList';
    this.market = market;
    this.MarketBaseStorageName ='marketBase';
    this.app = getApp();
  }




getAllMarkList() {
  var res = wx.getStorageSync(this.storageKeyName);
  if (!res) {
    res = require('../data/data.js').marketList;
    this.execSetStorageSync(res);
  }
  return res;
}

getAllMarketBase(){
  var res = wx.getStorageSync(this.MarketBaseStorageName);
  // if(!res){
  //   var url = this.app.globalData.exbaseBaseUrl +"GetExbaseInfo";
  //   this.app.util.get().then(res=>{
  //      console.log(res)
  //   })
  // }
  return res;
}

execSetStorageSync(data) {
  wx.setStorageSync(this.storageKeyName, data);
}

getMarketBase(){

} 

};
export { DB }
