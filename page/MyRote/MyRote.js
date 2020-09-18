// page/MyRote/MyRote.js
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
    total: 0,
    list: []
  },

  toDetail(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/MyRoteDetail/MyRoteDetail?id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    post('/app/member/saleMoney', {}, (res) => {
      var data = res.data.data;
      this.setData({
        total: data.total,
        list: data.allType
      })
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
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

  }
})