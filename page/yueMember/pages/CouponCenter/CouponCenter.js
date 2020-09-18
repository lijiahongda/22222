// page/yueMember/pages/CouponCenter/CouponCenter.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReceive: false,
    page: 1,
    pageSize: 10,
    isHaveMore: true
  },
  ininData: function() {
    let that = this
    that.setData({
      page:1
    })
    post('/mall/V2/getCouponList', {
      uid: wx.getStorageSync('uid'),
      couponActivityId: that.data.activityId,
      // couponActivityId:1 ,
      page: that.data.page,
      pageSize: that.data.pageSize,
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          page: that.data.page + 1,
          activityInfo: res.data.data.activityInfo,
          list: res.data.data.list,
          activityId: res.data.data.activityInfo.activityId
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
  // 立即使用
  ImmediateUse: function(e) {
    let that = this
    console.log('/page/yueMember/pages/ImmediateUse/ImmediateUse?cid=' + e.currentTarget.dataset.cid + '&activityId=' + that.data.activityId)
    wx.navigateTo({
      url: '/page/yueMember/pages/ImmediateUse/ImmediateUse?cid=' + e.currentTarget.dataset.cid + '&activityId=' + that.data.activityId,
    })
  },
  ReceiveImmediately:function(e){
    let that = this
    if(wx.getStorageSync('uid')){
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
    }else{
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
      })
    }
  },
  // 关闭
  closeisReceive: function(e) {
    this.setData({
      isReceive: this.data.isReceive?false: true
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      activityId: options.activityId
    })
    that.ininData()
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
    wx.setStorageSync('myrequest', '');
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
      post('/mall/V2/getCouponList', {
        uid: wx.getStorageSync('uid'),
        couponActivityId: 1,
        page: that.data.page,
        pageSize: that.data.pageSize
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data.list),
            page: res.data.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.list.length > 0 ? true : false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
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
      title: that.data.activityInfo.shareTitle,
      imageUrl: that.data.activityInfo.shareImg,
      path: "/page/yueMember/pages/CouponCenter/CouponCenter?reCode=" + value + '&activityId=' + that.data.activityId ,
      complete: (res) => {
        this.setData({
          showModalStatus: 1,
        })
      }
    }
  },
})