// page/community/pages/payment/Recharge/index.js
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
    textValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.openagreement()
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
  // 打开协议弹窗
  openagreement() {
    // 刷新个人信息
    post('/app/getBalanceRule', {}, (res) => {
      if (res.data.code == 200) {
        this.setData({
          textValue: res.data.data.str,
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  }
})