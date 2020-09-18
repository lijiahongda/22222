// page/Yuemall//pages/PinExplain/PinExplain.js
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that  = this
    that.getData()
  },
  getData: function () {
    let that = this;
    // https://api2.yuelvhui.com/app/member/bonusInstruction
    get('/app/member/bonusInstruction', {
      // recordId: e.currentTarget.dataset.recordid
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          rule:res.data.data
        })

      } else {

      }
      // 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid')
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))

    that.setData({
      showModal: true
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