// page/liveH5/h5Pay/h5Pay.js
import { post } from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'optiiii')
    let that = this
    wx.showLoading({
      title: '支付调起中',
    })
    var obj = {
      orderNo: options.ordersn,
      type: 3,
      addid: 'wxa404e150131464ed',
      openid: wx.getStorageSync('openId'),
      order_from:7
    }
    post('/mall/goToPay', obj, (res) => {
      console.log(res)
      if (res.data.code == 200) {

        wx.requestPayment({
          'timeStamp': res.data.data.getwayBody.timeStamp,
          'nonceStr': res.data.data.getwayBody.nonceStr,
          'package': res.data.data.getwayBody.package,
          'signType': 'MD5',
          'paySign': res.data.data.getwayBody.paySign,
          'success': function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '支付成功',
              icon: 'none'
            })
            wx.redirectTo({
              url: '/page/other/pages/PayResults/PayResults?orderNo=' + options.ordersn + '&balance=balance&isSuccess=' + true + '&payType=0' + '&address=' + that.data.address + '&mobile=' + that.data.mobile + '&receiverName=' + that.data.receiverName+'&islive=1'
              //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
            })
          },
          'fail': function (res) {
            wx.hideLoading()
            wx.redirectTo({
              url: '/page/other/pages/PayResults/PayResults?orderNo=' + options.ordersn + '&balance=balance&isSuccess=' + false + '&payType=0' + '&Mywinning=' + that.data.pagetype + '&address=' + that.data.address + '&mobile=' + that.data.mobile + '&receiverName=' + that.data.receiverName +'&islive=1'
              //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
            })
          },
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 7)
  }
})