import {
  get,
  post
} from '../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  onShow: function () {
    wx.redirectTo({
      url: '/page/videoDetail/pages/detail/detail'
    })
  },
})