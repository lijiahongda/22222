// page/yueMember/pages/modification/modification.js
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
    imgPath: '',
    wxNumber: '',
    wxImg: ''
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
  urlTobase64(url, type) {
    let that = this
    wx.request({
      url: 'https://api2.yuelvhui.com/common/uploadBase64', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        file: url
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          wxImg: res.data.url
        })
      }
    })
  },
  loadImg: function() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.urlTobase64('data:image/jpg;base64,' + res.data)
          }
        })
      }
    })
  },
  bindKeyInput: function(e) {
    let that = this;
    that.setData({
      wxNumber: e.detail.value
    })
  },
  save: function() {
    let that = this;
    post('/app/mall/addMemberHousekeeper', {
      mid: wx.getStorageSync('uid'),
      wxImg: that.data.wxImg,
      wxNumber: that.data.wxNumber
    }, res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'success'
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/page/EliteCard/EliteCard'
          })
        }, 2000)
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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