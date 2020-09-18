// page/yueMember/pages/ImmediateUse/ImmediateUse.js
import {
  get,
  post,
  retrunScene,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReceive: false,
    authorizationStatus: false
  },
  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  lookDetail: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  ininData: function() {
    let that = this
    post('/mall/V2/couponDetail', {
      uid: wx.getStorageSync('uid'),
      couponActivityId: that.data.couponActivityId,
      cid: that.data.cid
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          couponInfo: res.data.data.couponInfo,
          goodsInfo: res.data.data.goodsInfo,
          remind: res.data.data.remind
        })
      } else if (res.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '网络错误 ',
          icon: 'none',
          duration: 1000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    post('/share/mallCouponShare', {
      cid: that.data.cid
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          shareInfo: res.data
        })
      } else if (res.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '网络错误 ',
          icon: 'none',
          duration: 1000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  // 关闭
  closeisReceive: function() {
    this.setData({
      isReceive: this.data.isReceive ? false : true
    })
  },
  ReceiveImmediately: function (e) {
    let that = this
    post('/mall/sendCoupon', {
      uid: wx.getStorageSync('uid'),
      cid: e.currentTarget.dataset.cid
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        this.setData({
          isReceive: true
        })
        that.ininData()
      } else if (res.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '网络错误 ',
          icon: 'none',
          duration: 1000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      cid: options.cid,
      couponActivityId: options.activityId
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
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false,
        cardType: wx.getStorageSync('cardType')
      })
      wx.showShareMenu({
        withShareTicket: true
      })
      that.ininData()
    } else {
      that.ininData()
      wx.hideShareMenu()
      if (wx.getStorageSync('mapId')) {
        //说明已经授权，去绑定
        console.log('说明已经授权，去绑定======')
        that.setData({
          authorizationStatus: true
        })
      } else {
        //还未授权，去授权
        console.log('还未授权，去授权')
        that.setData({
          authorizationStatus: true
        })
      }
    }
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
    let that = this
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route
    var options = currentPage.options
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')
    } catch (e) {
      // Do something when catch error
    }
    
    return {
      title: that.data.shareInfo.goodsName,
      imageUrl: that.data.shareInfo.img,
      path: "/page/yueMember/pages/ImmediateUse/ImmediateUse?reCode=" + value + '&activityId=' + that.data.couponActivityId+'&cid='+that.data.cid
    }
  },
})