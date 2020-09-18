import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:'',
    isSmallRedPopup: true
  },
  onLoad: function (options) {
    let that = this;
    get('/app/card/right/v2/getSettlePic', {}, res => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          img: res.data.data.wechat
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  onShow: function () {
    let that = this
    if (wx.getStorageSync('uid')) {
      console.log('登陆了')
      wx.showShareMenu({
        withShareTicket: true
      })
      that.setData({
        isSmallRedPopup: false
      })

    } else {
      wx.hideShareMenu()
      //没登录
      this.setData({
        LoadingStatus: false
      })
    }
  },
  
  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },

  btn:function(){
    let that = this
    if (that.data.isSmallRedPopup){
      that.VerificationCode()
      return
    }
    post('/app/card/buyCard', {
      "payType": 3, //1=> 微信 2=> 支付宝
      "cardType": 1, //精英卡
      "type": 1,//1=>WX_APP 2=>ALI_APP
    }, res => {
      if (res.data.code == 200) {
        wx.showLoading({
          title: '支付中',
        });
        that.setData({
          orderNo: res.data.orderNo
        })
        wx.requestPayment({
          'timeStamp': res.data.pay.getwayBody.timeStamp,
          'nonceStr': res.data.pay.getwayBody.nonceStr,
          'package': res.data.pay.getwayBody.package,
          'signType': 'MD5',
          'paySign': res.data.pay.getwayBody.paySign,
          'success': function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              success:function(){
                setTimeout(function(){
                  app.globalData.couponBox = true
                  wx.switchTab({
                    url: '/page/EliteCard/EliteCard'
                  })
                },2000)
              }
            })
          },
          'fail': function (res) {
            wx.hideLoading()
            that.setData({
              shwoAgain:true
            })
          },
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  again:function(){
    let that = this
    that.setData({
      shwoAgain: false
    })
    post('/app/card/payParams/', {
      orderNo: that.data.orderNo
    }, (res) => {
      if (res.data.code == 200) {
        wx.requestPayment({
          'timeStamp': res.data.pay.getwayBody.timeStamp,
          'nonceStr': res.data.pay.getwayBody.nonceStr,
          'package': res.data.pay.getwayBody.package,
          'signType': 'MD5',
          'paySign': res.data.pay.getwayBody.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              success: function () {
                setTimeout(function () {
                  app.globalData.couponBox = true
                  wx.switchTab({
                    url: '/page/EliteCard/EliteCard'
                  })
                }, 2000)
              }
            })
          },
          'fail': function (res) {
            that.setData({
              shwoAgain: true
            })
          },
          'complete': function (res) {
          }
        })
      } else { }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  }
  
})