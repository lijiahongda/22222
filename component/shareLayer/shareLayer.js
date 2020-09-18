// component/shareLayer/shareLayer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    sharelayer: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 页面内分享
    onShare: function () {
      if (wx.getStorageSync('uid')) {
        this.setData({
          sharelayer: true
        })
      } else {
        wx.navigateTo({
          url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
        })
      }
    },

    goPoster: function () {
      wx.navigateTo({
        url: "/page/other/pages/poster/poster?goodsId=" + this.data.activityId + '&url=' + '/share/mallNewIconShareForward' + '&id=mustBuy',
      })
    },
    // 关闭分享
    shareLayerClosed: function () {
      this.setData({
        sharelayer: false
      })
    },
  }
})
