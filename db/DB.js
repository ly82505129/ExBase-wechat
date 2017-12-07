class DB {
  constructor(market) {
    this.storageKeyName = 'marketList';
    this.market = market;
  }


getAllMarkList() {
  var res = wx.getStorageSync(this.storageKeyName);
  if (!res) {
    res = require('../data/data.js').marketList;
    this.execSetStorageSync(res);
  }
  return res;
}

execSetStorageSync(data) {
  wx.setStorageSync(this.storageKeyName, data);
}

getMarketBase(){

}

};
export { DB }
