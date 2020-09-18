import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      cardType: wx.getStorageSync('cardType')
    })
  },
  join: function (e) { //加入悦旅会
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },
  onShow: function () {
    
  }
})