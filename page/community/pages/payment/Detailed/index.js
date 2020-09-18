// page/payment/Detailed/index.js
import {
  get,
  post,
  retrunScene,
  relations
} from '../../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    LoadingStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTradeList()
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

  },
  // 获取交易明细列表
  getTradeList(){
    var page = this.data.page
    var lists = this.data.list
    this.setData({
      LoadingStatus:true
    })
    // 获取交易明细列表
    post('/app/member/balance/tradeDetail', {page}, (res) => {
      if (res.data.code == 200) {
        page++
        for(let item of res.data.data){
          console.log(item)
          lists.push(item)
        }
        this.setData({
          page,
          list: lists,
          LoadingStatus: false
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },
  // 去首页
  toMain(){
    wx.switchTab({
      url: '/page/Mall/YueMall',
    })
  }
})