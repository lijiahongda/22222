// page/Yuemall//pages/SuccessfulComments/SuccessfulComments.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    isHaveMore: true
  },
  comment: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/evaluate/evaluate?img=',
    })
  },
  dataorder: function() {
    let that = this
    post('/mall/getNoCommentOrder', {
      uid: wx.getStorageSync('uid'),
      page: that.data.page,
      pageSize: that.data.pageSize
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          page: that.data.page + 1,
          list: res.data.data
        })
        wx.hideLoading()
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  evaluate: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/evaluate/evaluate?recordid=' + e.currentTarget.dataset.orderno + '&productid=' + e.currentTarget.dataset.goodid + '&skuid=' + e.currentTarget.dataset.skuid + '&img=' + e.currentTarget.dataset.img,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.dataorder()
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
    wx.navigateBack({
      delta: 2
    })
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
    let that = this
    if (that.data.isHaveMore) {
      post('/mall/getNoCommentOrder', {
        uid: wx.getStorageSync('uid'),
        page: that.data.page,
        pageSize: that.data.pageSize
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data),
            page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.length > 0 ? true : false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  }
})