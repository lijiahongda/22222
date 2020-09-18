// page/Yuemall//pages/RefundApply/RefundApply.js
import { get, post } from '../../../../utils/util.js';
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changes:''
  },
  // 退款
  refundMoney:function(){
    this.setData({
      changes:1
    })
    app.globalData.changes=this.data.changes
    wx.redirectTo({
      url: '/page/Yuemall/pages/RefundDetail/RefundDetail?changes=' + this.data.changes + '&ordersn=' + this.data.ordersn,
    })
  },
  // 退货退款
  refundApply:function(){
    this.setData({
      changes: 2
    })
    app.globalData.changes = this.data.changes
    wx.redirectTo({
      url: '/page/Yuemall/pages/RefundDetail/RefundDetail?changes=' + this.data.changes+'&ordersn='+this.data.ordersn,
    })
  },
  getlist(options){
    this.setData({
      services: !this.data.services
    })
    let data = {
      subOrderNo:options.ordersn
    }
    post('/app/member/orderBrief', data, (res) => {
      if (res.data.code == 200) {
        
        this.setData({
          goodmsg: res.data.data
        })
        console.log(res)
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist(options)
    this.setData({
      ordersn:options.ordersn
    })
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