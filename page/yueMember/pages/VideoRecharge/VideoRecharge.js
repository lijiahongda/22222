// page/yueMember//pages/VideoRecharge/VideoRecharge.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false
  },
  // 分类列表
  classificationList: function (e) {
    app.classificationList(e, this)
  },
  VideoRechargeDetail: function(e) {
    wx.navigateTo({
      url: '/page/yueMember/pages/VideoRechargeDetail/VideoRechargeDetail?projectid=' + e.currentTarget.dataset.projectid
    })
  },
  initData: function() {
    let that = this
    get('/vcard/newCardList', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data.list,
          material: res.data.data.material
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.showLoading({
      title: '加载中',
      icon: 'none'
    })
    that.setData({
      cardType: wx.getStorageSync('cardType')
    })
    that.initData()
  },
  join: function() {
    wx.switchTab({
      url: '/page/EliteCard/EliteCard'
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
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
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

  }
})