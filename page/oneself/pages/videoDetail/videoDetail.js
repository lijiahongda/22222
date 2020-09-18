import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    
  },
  gopay: function (e) {
    var that = this
    post('/app/card/payParams/', {
      orderNo: that.data.orderon
    }, (res) => {
      if (res.data.code == 200) {
        wx.requestPayment({
          'timeStamp': res.data.pay.getwayBody.timeStamp,
          'nonceStr': res.data.pay.getwayBody.nonceStr,
          'package': res.data.pay.getwayBody.package,
          'signType': 'MD5',
          'paySign': res.data.pay.getwayBody.paySign,
          'success': function (res) {

          },
          'fail': function (res) {
          },
          'complete': function (res) {
          }
        })
      } else { }
    }, 1, that.data.token, true, that.data.uid)
  },
  //获取页面内容
  getOrderList: function () {
    var that = this;
    post('/vcard/orderInfo', {
      "order_sn": that.data.orderon
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          add_time: res.data.data.add_time,
          mobile: res.data.data.mobile,
          goods_image: res.data.data.goods_image,
          official_price: res.data.data.official_price,
          total_amount: res.data.data.total_amount,
          spread_price: res.data.data.spread_price,
          order_docs: res.data.data.order_docs,
          productId: res.data.data.productId,
          order_sn: res.data.data.order_sn,
          order_status: res.data.data.order_status
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid)
  },
  pay: function () {
    let that = this
    wx.showToast({
      title: '支付中',
      icon: 'none'
    })
    post('/vcard/vCardPay', {
      p_id: that.data.productId,
      mobile: that.data.mobile,
      order_sn: that.data.order_sn,
      p_type: 3
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
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
              icon: 'none'
            })
            console.log('-----')
            wx.navigateTo({
              url: '/page/yueMember/pages/VideoPayResults/VideoPayResults?type=' + 1 +'&pid='+ that.data.productId
            })
          },
          'fail': function (res) {
            wx.hideLoading()
            wx.navigateTo({
              url: '/page/yueMember/pages/VideoPayResults/VideoPayResults?type=' + 2 + '&pid=' + that.data.productId
            })
          },
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  onLoad: function (options) {
    this.setData({
      orderon: options.orderno,
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      statusname: options.statusname,
      cardType:wx.getStorageSync('cardType')
    })
    console.log(options)
    
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onShow: function () {
    this.getOrderList();
  }
})