import {
  get,
  post,
  retrunScene,
  relations
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponInfo: {},
    goodsInfo: {},
    remind: [],
    noCanGet: false,
    authorizationStatus: true,
    getCoupons: 1, // 0 为分享；1 为领取页面
    type: 39 // 7-全部使用卷；39-活动使用卷
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let cid = '',
      reCode = '',
      getCoupons = 1,
      parentId = '',
      type = 39
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        reCode = sceneObj.C;
        cid = sceneObj.I;
        getCoupons = sceneObj.U;
        parentId = sceneObj.P
        type = sceneObj.T
      });
    } else {
      reCode = options.reCode;
      cid = options.cid;
      getCoupons = options.getCoupons
      type = options.type
      parentId = options.parentId
    }
    this.setData({
      cid: cid, // 卷id
      reCode: reCode, // 邀请码
      getCoupons: getCoupons, // 
      parentId: parentId, // 分享人的uid
      type: type
    })
    console.log(parentId, '分享人')
    this.ininData()
  },

  ininData: function() {
    let that = this
    let obj = {
      uid: that.data.parentId,
      cid: that.data.cid,
    }
    if (that.data.parentId) {
      obj.memberId = wx.getStorageSync('uid') // 领取者的ID
    }
    console.log(obj, '----------')
    post('/mall/V2/getShareCouponDetail', obj, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          couponInfo: res.data.data.couponInfo,
          img: res.data.data.img,
          id: res.data.data.id,
          remind: res.data.data.remind,
          state: res.data.data.state,
          sehareInfo: res.data.data.shareInfo.wx
        })
        console.log(res.data.data.state, 'state')
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
    if (that.data.type == 5) {
      post('//share/threeCouponWxShare', {
        cid: that.data.cid
      }, (res) => {
        if (res.data.code == 200) {
          console.log(res)
          that.setData({
            sehareInfo: res.data
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
    }
  },
  activityDetail(e) {
    app.classificationList(e, this)
  },
  goHome() {
    wx.switchTab({
      url: '/page/Mall/YueMall',
    })
  },
  getUse() {
    wx.showToast({
      title: '请您到悦淘APP使用',
      icon: 'none',
      duration: 3000
    })
  },
  getCoupons() {
    let that = this
    if (!noCanGet) {
      post('/mall/V2/getCoupon', {
        "uid": that.data.parentId, //分享者的id
        "cid": that.data.cid, //优惠券的ID
        "memberId": wx.getStorageSync('uid') // 领取者的ID
      }, (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            noCanGet: true
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            noCanGet: true
          })
        } else {
          wx.showToast({
            title: '网络错误 ',
            icon: 'none',
            duration: 1000
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    }

  },
  // 手机号验证码
  VerificationCode: function() {
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber=' + that.data.reCode
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      this.setData({
        authorizationStatus: false
      })
    } else {
      this.setData({
        authorizationStatus: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log(wx.getStorageSync('uid'), '分享')
    return {
      path: 'page/yueMember/pages/couponsActivity/couponsActivity?cid=' + this.data.cid + '&getCoupons=1' + '&getCoupons=1&reCode' + wx.getStorageSync('selfReCode') + '&parentId=' + wx.getStorageSync('uid') + '&type=' + this.data.type,
      imageUrl: this.data.sehareInfo.img,
      title: this.data.sehareInfo.title
    }
  }
})