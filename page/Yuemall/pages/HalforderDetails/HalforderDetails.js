import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    token: '',
    orderSon: '',
    orderStatus: '',
    payStatus: '',
    shippingStatus: '',
    ordersn: '',
    goodNum: '',
    goodName: '',
    createTime: '',
    address: '',
    linkName: '',
    linkTel: '',
    info: []
  },
  // 复制单号
  copyText: function (e) {
    wx.setClipboardData({
      data: "'" + e.currentTarget.dataset.text + "'",
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
      },
      complete(res) {
      }
    })
  },
  getOrderList: function () {
    let that = this
    post('/mall/member/order/flashOrderDetail', {
      orderNo: that.data.orderSon,
      uid:wx.getStorageSync('uid')
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          orderStatus: res.data.data.orderStatus,
          payStatus: res.data.data.payStatus,
          shippingStatus: res.data.data.shippingStatus,
          ordersn: res.data.data.orderNo,
          createTime: res.data.data.createTime,
          address: res.data.data.address,
          linkName: res.data.data.linkName,
          linkTel: res.data.data.linkTel,
          totalPrice: res.data.data.actualPrice,
          actualPrice: res.data.data.actualPrice,
          couponPrice: res.data.data.couponPrice,
          totelDeducPrice: res.data.data.coin,
          goodFreight: res.data.data.totalFeight,
          tatal: res.data.data.totalMoney,
          shippingStatus: res.data.data.shippingStatus,
          logisticeState: res.data.data.logisticeState,
          logisticeNumber: res.data.data.logisticeNumber,
          logisticeCompany: res.data.data.logisticeCompany,
          goodsInfo: res.data.data.goodsInfo,
          goodsThreePartner: res.data.data.goodsInfo[0].goodsThreePartner,
          info: res.data.data.logisticeInfo
        })

      } else {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid,4)
  },
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      orderSon: options.orderSon
    })
    this.getOrderList();
  },
  onPullDownRefresh: function () {
    this.getOrderList();

  },
  onShow: function () {

  }
})