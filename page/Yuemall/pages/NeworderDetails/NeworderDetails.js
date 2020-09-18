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
  // 平台客服
  CustomerService: function () {
    wx.makePhoneCall({
      phoneNumber: '400 110 9600'
    })
  },
  // 确认收货
  ConfirmReceipt: function (e) {
    let that = this
    post('/app/member/confirmReceipt', {
      subOrderSn: e.currentTarget.dataset.orderson
    }, (res) => {
      if (res.data.code == 200) {
        that.getOrderList()
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 复制单号
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) { }
        })
      },
      complete(res) { }
    })
  },
  // 售后进度
  aftersaleProgree:function(e){
    wx.navigateTo({
      url: '/page/Yuemall/pages/afterSaleProgree/afterSaleProgree?ordersn=' + e.currentTarget.dataset.subordersn
    })
  },
  // 申请退款
  // applyRefund:function(e){
  //   let that = this
  //   console.log(e.currentTarget.dataset.subordersn)
  //   post('/app/member/refundApply', {
  //     orderNo: e.currentTarget.dataset.subordersn
  //   }, (res) => {
  //     if (res.data.code == 200) {
  //       that.getOrderList()
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon: 'none'
  //       })
  //     } else {
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon: 'none'
  //       })
  //     }
  //   }, 1, that.data.token, true, that.data.uid)
  // },
  modify: function() {
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/modifyOrderAddress/modifyOrderAddress?orderNo=' + that.data.orderSon + '&receivername=' + that.data.receivername + '&mobile=' + that.data.mobile + '&provicename=' + that.data.provicename + '&cityname=' + that.data.cityname + '&zonename=' + that.data.zonename + '&townName=' + that.data.townName + '&address=' + that.data.address + '&proviceId=' + that.data.proviceId + '&cityId=' + that.data.cityId + '&zoneId=' + that.data.zoneId + '&townId=' + that.data.townId
    })
  },
  BuyAgain: function(e) {
    let that = this
    post('/app/mall/order/goToPay', {
      type: 3,
      orderNo: e.currentTarget.dataset.orderson
    }, (res) => {
      if (res.data.code == 200) {
        wx.requestPayment({
          'timeStamp': res.data.pay.getwayBody.timeStamp,
          'nonceStr': res.data.pay.getwayBody.nonceStr,
          'package': res.data.pay.getwayBody.package,
          'signType': 'MD5',
          'paySign': res.data.pay.getwayBody.paySign,
          'success': function(res) {
            wx.showToast({
              title: '支付成功',
              icon: 'none'
            })
            if (that.data.isMemberGoods == 1) {
              wx.navigateTo({
                url: '/page/other/pages/PayResults/PayResults?orderNo=' + e.currentTarget.dataset.orderson + '&balance=balance&isSuccess=' + true + '&payType=0' + '&Mywinning=' + 'dalibao' + '&typePage=' + 'dalibao'
                //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
              })
            } else {
              wx.switchTab({
                url: '/page/personalCenter/personalCenter'
              })
            }
          },
          'fail': function(res) {
          },
        })
      } else if (res.data.status == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid)
  },
  ViewLogistics: function(e) {
    let {
      recordid,
      img,
      num,
      spec,
      price,
      name
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/page/Yuemall/pages/ViewLogistics/ViewLogistics?recordid=' + recordid + '&img=' + img + '&num=' + num + '&spec' + spec + '&price=' + price + '&name=' + name
    })
  },
  //退款申请
  refundbutton:function(e){
    wx.navigateTo({
      url: '/page/Yuemall/pages/RefundApply/RefundApply?ordersn=' + e.currentTarget.dataset.subordersn,
    })
    // wx.navigateTo({
    //   url: '/page/Yuemall/pages/RefundApply/RefundApply?ordersn=' + this.data.orderSon,
    // })
  },
  applyrefund:function(e){
    console.log(wx.getStorageSync('changes'))

    wx.navigateTo({
      url: '/page/Yuemall/pages/RefundExamine/RefundExamine?ordersn=' + e.currentTarget.dataset.subordersn + '&changes=' + wx.getStorageSync('changes'),
    })
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
  getOrderList: function() {
    let that = this
    let url = ''
    let obj = {}
    if (that.data.type == '') {
      url = '/app/member/newestMallOrderDetail'
      obj.orderNo = that.data.orderSon
    } else {
      // 售后
      url = '/app/member/refundOrderDetail'
      obj.subOrderNo = that.data.orderSon
    }
   
    post(url, obj, (res) => {
      if (res.data.code == 200) {
        that.setData({
          orderStatus: res.data.data.orderStatus,
          payStatus: res.data.data.payStatus,
          shippingStatus: res.data.data.shippingStatus,
          ordersn: res.data.data.orderNo,
          createTime: res.data.data.createTime,
          addressdetail: res.data.data.address,
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
          info: res.data.data.logisticeInfo,
          orderType: res.data.data.orderType,
          updateStatus: res.data.data.updateStatus,
          receivername: res.data.data.linkName,
          mobile: res.data.data.linkTel,
          provicename: res.data.data.provicename,
          cityname: res.data.data.cityname,
          zonename: res.data.data.zonename,
          townName: res.data.data.townname,
          address: res.data.data.detailAddress,
          proviceId: res.data.data.proviceId,
          cityId: res.data.data.cityId,
          zoneId: res.data.data.zoneId,
          townId: res.data.data.townId,
          isMemberGoods: res.data.data.goodsInfo[0].isMemberGoods
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 售后
  service: function() {

  },
  onLoad: function(options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      orderSon: options.orderSon,
      type: options.type
    })

  },
  // 申请售后
  apply: function(e) {
    let goods = JSON.stringify(e.currentTarget.dataset.item)
    wx.redirectTo({
      url: '/page/Yuemall/pages/applyProgree/applyProgree?goods=' + goods + '&ordersn=' + e.currentTarget.dataset.subordersn
    })
  },
  // 再次购买 跳转商品详情
  Repurchase: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  onPullDownRefresh: function() {
    this.getOrderList();

  },
  onShow: function() {
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    
    if (!wx.getStorageSync('uid')){
      this.VerificationCode()
      return
    }

    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      orderSon: options.orderSon,
      type: options.type
    })

    this.getOrderList();
  },
  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
})