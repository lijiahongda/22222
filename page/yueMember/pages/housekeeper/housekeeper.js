// page/yueMember/pages/housekeeper/housekeeper.js
import {
  get,
  post,
  wxLogin,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //预设当前项的值
    wechatNumber: 'vgjbkjdykl',
    callNumber: '1677899876',
    housekeeperInfo: null,
    parentInfo: null
  },
  copyText: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {}
        })
      }
    })
  },
  toModification: function() {
    wx.navigateTo({
      url: '/page/yueMember/pages/modification/modification'
    })
  },

  saves: function() {
    let img = this.data.housekeeperInfo.wxImg
    if (this.data.currentTab != 0) {
      img = this.data.parentInfo.wxImg
    }
    wx.downloadFile({
      url: img,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail: function (res) { }
        })
      },
      fail: function () {
        wx.showToast({
          title: res.errMsg,
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
 
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  initData: function() {
    let that = this;
    post('/app/mall/getMemberHousekeeper', {
      mid: wx.getStorageSync('uid')
    }, res => {
      if (res.data.code == 200) {
        that.setData({
          housekeeperInfo: res.data.data
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    post('/app/mall/getParentHousekeeper', {
      mid: wx.getStorageSync('uid')
    }, res => {
      if (res.data.code == 200) {
        that.setData({
          parentInfo: res.data.data
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.initData();
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

  }
})