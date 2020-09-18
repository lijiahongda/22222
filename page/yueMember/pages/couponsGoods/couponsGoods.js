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
    couponInfo:{},
    goodsInfo:{},
    remind:[],
    noCanGet:false,
    reCode:'',
    authorizationStatus:true,
    getCoupons: 1 // 0 为分享；1 为领取页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cid='',
      reCode = '',
      getCoupons = 1,
      parentId=''
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        reCode = sceneObj.C;
        cid = sceneObj.I;
        getCoupons = sceneObj.U;
        parentId = sceneObj.P
      });
    } else {
      reCode = options.reCode;
      cid = options.cid;
      getCoupons = options.getCoupons
      parentId = options.parentId
    }
    this.setData({
      cid: cid,
      reCode: reCode,
      getCoupons: getCoupons,
      parentId: parentId
    })
    wx.setStorage({
      key: "ortherReCode",
      data: reCode
    });
    this.ininData()
  },

  ininData: function () {
    let that = this
    post('/mall/V2/couponDetail', {
      uid: that.data.parentId,
      couponActivityId: 1,
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
      } else if (res.data.code == 400) {
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
  goodsDetail(e){
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  getCoupons(){
    let that=this
    if(wx.getStorageSync('uid')){
      post('/mall/V2/getCoupon', {
        "uid": that.data.parentId,  //分享者的id
        "cid": that.data.cid,  //优惠券的ID
        "memberId": wx.getStorageSync('uid')  // 领取者的ID
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
    }else{
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode',
      })
    }
   
  },
  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber=' + this.data.reCode
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(wx.getStorageSync('uid')){
      this.setData({
        authorizationStatus:false
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    }else{
      this.setData({
        authorizationStatus: true
      })
      wx.hideShareMenu()
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: '/page/yueMember/pages/couponsGoods/couponsGoods?cid=' + this.data.cid + '&getCoupons=1&reCode' + wx.getStorageSync('selfReCode') + '&parentId=' + wx.getStorageSync('uid')
    }
  }
})