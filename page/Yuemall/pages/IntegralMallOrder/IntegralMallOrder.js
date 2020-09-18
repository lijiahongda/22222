import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    uid: '',
    token: '',
    currentTab: 0, //预设当前项的值,
    list: [],
    page: 1,
    pageSize: 10,
    orderType: 0,
    isHaveMore: true,
    showModal: false,
    isdel: false
  },
  confirm: function () {
    let that = this
    that.setData({
      isdel: false,
      page: 1
    })
    post('/app/member/mallNewOrderDelete', {
      orderNo: that.data.orderNo
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.wholelist()
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  canceldelete: function () {
    this.setData({
      isdel: false
    })
  },
  delete: function (e) {
    this.setData({
      isdel: true,
      orderNo: e.currentTarget.dataset.orderno
    })
  },
  ToExchange:function(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMall/IntegralMall',
    })
  },
  // 复制单号
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
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
  // // 删除
  // delete: function () {
  //   let that = this;
  //   that.setData({
  //     isdel: that.data.isdel?false:true
  //   })
  // },
  // 查看物流
  LogisticsInfo: function (e) {
    let that = this;
    post('/app/member/getLogisticsMessage', {
      recordId: e.currentTarget.dataset.recordid
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          logistice_company: res.data.list.logistice_company,
          logistice_number: res.data.list.logistice_number,
          logistice_state: res.data.list.logistice_state
        })

      } else {

      }
    }, 1, that.data.token, true, that.data.uid)

    that.setData({
      showModal: true
    })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    this.setData({
      showModal: false,
      Share: true,
      gopay: false
    })
    // 隐藏遮罩层
    this.setData({
      showModal: false,
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  ConfirmReceipt: function (e) {
    let that = this
    post('/app/member/mallVerifyorder', {
      orderNo: e.currentTarget.dataset.orderson
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          // list: res.data.list
        })

      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  del: function (e) {
    let that = this
    post('/app/member/mallOrderDelete', {
      orderNo: e.currentTarget.dataset.orderson
    }, (res) => {
      if (res.data.status == 200) {
        for (var v of that.data.list) {
          if (v.orderSon == e.currentTarget.dataset.orderson) {
            let list = that.data.list
            list.remove(v)
            that.setData({
              list: list
            })
          }
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 再次购买 跳转商品详情
  Repurchase: function (e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodid,
    })
  },
  BuyAgain: function (e) {
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
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'none'
            })
            wx.navigateTo({
              url: '../orderList/orderList',
            })
          },
          'fail': function (res) {
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
  orderDetails: function (e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMallOrderDetail/IntegralMallOrderDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  onUnload: function () {
    if (this.data.balance == 'balance') {
      wx.navigateBack({
        delta: 2
      })
    }
  },
  // 全部订单
  wholelist: function () {
    let that = this
    post('/mall/integral/order/myOrder', {
      page: that.data.page
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          wholelist: res.data.data.item,
          page: that.data.page + 1
        })

      } else {

      }
    }, 1, that.data.token, true, that.data.uid,4)
  },
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      balance: options.balance
    })
    this.wholelist();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if (this.data.isHaveMore) {
      post('/mall/integral/order/myOrder', {
        page: that.data.page
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            wholelist: that.data.wholelist.concat(res.data.data.item),
            page: res.data.data.item.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.item.length > 0 ? true : false
          })
        } else {

        }
      }, 1, that.data.token, true, that.data.uid, 4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  },
  onPullDownRefresh: function () {

  },
  onShow: function () {

  }
})