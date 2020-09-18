// page/Yuemall//pages/CouponList/CouponList.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  orderData:function(){
    let that = this
    post('/mall/secoo/secooCouponList', {
      uid: wx.getStorageSync('uid')
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          list: res.data.data
        })
      }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  coupon:function(e){
    let that = this
    post('/mall/secoo/sendSecooCoupon', {
      uid: wx.getStorageSync('uid'),
      typeId: e.currentTarget.dataset.id
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '领取成功',
          icon: 'none'
        })
        that.orderData()
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  ActivationCode:function(e){
    wx.navigateTo({
      url: '/page/Yuemall/pages/ActivationCode/ActivationCode?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that= this
    that.orderData()
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


})