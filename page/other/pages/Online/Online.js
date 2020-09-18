// page/other/pages/Online/Online.js
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
    wx.setStorage({
      key: 'ortherReCode',
      data: options.reCode,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    // if (wx.getStorageSync('uid')) {
    //   //已经绑定了
    //   console.log('已经绑定了')
    //   that.setData({
    //     authorizationStatus: false
    //   })
    //   wx.showShareMenu({
    //     withShareTicket: true
    //   })
    // } else {
    //   wx.hideShareMenu()
    //   that.setData({
    //     authorizationStatus: true
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '悦淘好大夫在线免费义诊',
      path: "page/other/pages/Online/Online" + "?reCode=" + wx.getStorageSync('selfReCode')
    }
  }
})