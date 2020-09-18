// page/liveH5/shopDetail/shopDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'333')
    wx.navigateTo({
      url: '/page/liveH5/shopDetail/mywebview/index?options='+JSON.stringify(options),
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('123')
    var isback=wx.getStorageSync('isback')
    console.log(isback)
    console.log(isback == '1')
    if(isback=='1'){
      wx.removeStorageSync('isback')
      wx.switchTab({
        url: '/page/Mall/YueMall',
      })
    }
    
  }
})