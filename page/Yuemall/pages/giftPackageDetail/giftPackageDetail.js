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
  ConfirmReceipt: function(e) {
    let that = this
    post('/app/member/mallVerifyorder', {
      orderNo: e.currentTarget.dataset.orderson
    }, (res) => {
      if (res.data.status == 200) {
        that.getOrderList()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 复制单号
  copyText: function(e) {
    wx.setClipboardData({
      data: "'" + e.currentTarget.dataset.text + "'",
      success(res) {
        wx.getClipboardData({
          success(res) {}
        })
      },
      complete(res) {}
    })
  },
  // 售后进度
  aftersaleProgree: function (e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/afterSaleProgree/afterSaleProgree?ordersn=' + this.data.ordersn
    })
  },
  // 申请售后
  apply: function(e) {
    let goods = JSON.stringify(e.currentTarget.dataset.item)
    wx.redirectTo({
      url: '/page/Yuemall/pages/applyProgree/applyProgree?goods=' + goods + '&ordersn=' + this.data.ordersn
    })
  },
  getOrderList: function() {
    let that = this
    post('/app/member/sendGoodsOrderDetail', {
      orderNo: that.data.orderSon
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          address: res.data.data.receiverAddress,
          linkName: res.data.data.receiverName,
          linkTel: res.data.data.receiverMobile,
          ordersn: res.data.data.orderNo,
          createTime: res.data.data.orderTime,
          goodsImg: res.data.data.goodsImg,
          goodsName: res.data.data.goodsName,
          goodsPrice: res.data.data.goodsPrice,
          goodsSpec: res.data.data.goodsSpec,
          logisticeCompany: res.data.data.logisticeCompany,
          logisticeNum: res.data.data.logisticeNum,
          remind: res.data.remind,
          isSend: res.data.data.isSend,
          orderStatus: res.data.data.orderStatus,
          refundButtonType: res.data.data.refundButtonType,
          goods:res.data.data,
          refundButtonText: res.data.data.refundButtonText
        })

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid)
  },
  onLoad: function(options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      orderSon: options.orderSon
    })
    this.getOrderList();
  },
  onShow: function() {
    wx.setStorageSync('myrequest', '');
  }
})