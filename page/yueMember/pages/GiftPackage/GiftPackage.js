// page/yueMember/pages/GiftPackage/GiftPackage.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    isHaveMore: true
  },
  modifyOrderAddress: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/modifyOrderAddress/modifyOrderAddress?orderNo=' + e.currentTarget.dataset.orderno+'&type='+'add'
    })
  },
  lookDetail: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/giftPackageDetail/giftPackageDetail?orderSon=' + e.currentTarget.dataset.orderno
    })
  },
  initData: function() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      page:1
    })
    post('/app/member/sendGoodsOrderList', {
      page: that.data.page,
      pageSize: that.data.pageSize
    }, (res) => {
      if (res.data.code == 200) {
        wx.hideLoading()
        that.setData({
          list: res.data.list,
          page: that.data.page + 1
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
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
    wx.setStorageSync('myrequest', '');
    that.initData()
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
    let that = this
    if (this.data.isHaveMore) {
      post('/app/member/sendGoodsOrderList', {
        page: that.data.page,
        pageSize: that.data.pageSize
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.list),
            page: res.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.list.length > 0 ? true : false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  }
})