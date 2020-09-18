// page/Yuemall//pages/NewLevelPages/NewLevelPages.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.setNavigationBarTitle({
      title: options.name,
    })
    console.log(options)
    that.selectComponent("#makeupFood")._onOption(options)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.selectComponent("#makeupFood")._onReachBottom()
  },
})