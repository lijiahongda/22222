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
    currentTabPdd: 0, //pdd预设当前项的值,
    list: [],
    page: 1,
    pageSize: 10,
    page_size:10,
    orderType: 0,
    type:0,
    isHaveMore: true,
    showModal: false,
    isdel: false,
    tabStatus:0,
    isHaveMorePddd:true,
    isHaveMoreJd:true,
    currentTabJd: 0,//jd预设当前项的值,
    status:-1,//
    AfterSale: [], //退款列表
    // truename:''   图书字段
  },
  // 订单说明
  PinExplain:function(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/PinExplain/PinExplain' ,
    })
  },
  // 平台客服
  CustomerService: function () {
    wx.makePhoneCall({
      phoneNumber: '400 110 9600'
    })
  },
  // 点击商城
  getSc: function () {
    let that = this;
    that.setData({
      tabStatus:0,
      page:1
    })
    wx.setNavigationBarTitle({
      title: '商城订单',
    })
    if (that.data.cur == 0) {
      this.wholelist();
    } else if (that.data.cur == 5) {
      this.afterSale()
    } else {
      this.Otherlist()
    }
  },
  // 点击京东
  getJd: function () {
    let that = this;
    that.setData({
      tabStatus: 2,
      page:1
    })
    wx.setNavigationBarTitle({
      title: '京东订单',
    })
    this.jdList()
  },
  // 点击拼多多
  getPdd: function () {
    let that = this;
    that.setData({
      tabStatus: 1,
      page: 1
    })
    wx.setNavigationBarTitle({
      title: '拼多多订单',
    })
    this.pddList()
  },
  onLoad: function(options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      balance: options.balance,
      currentTab: options.cur,
      orderType: options.cur,
      page: 1
    })
    console.log(options.cur)
    if (options.cur == 0) {
      this.wholelist();
    } else if (options.cur == 5) {
      this.afterSale()
    } else {
      this.Otherlist()
    }
  },
  confirm: function() {
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
        if (that.data.currentTab == 0) {
          that.wholelist()
        } else {
          that.Otherlist()
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  canceldelete: function() {
    this.setData({
      isdel: false
    })
  },
  delete: function(e) {
    this.setData({
      isdel: true,
      orderNo: e.currentTarget.dataset.orderno
    })
  },
  // 复制单号
  copyText: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {}
        })
      },
      complete(res) {}
    })
  },
  // 复制pdd单号
  copyTextJd: function (e) {
    console.log(e.currentTarget.dataset.text)
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
  copyText: function (e) {
    console.log(e.currentTarget.dataset.text)
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
  see:function(){
    wx.redirectTo({
      url: '/page/Yuemall/pages/PinHome/PinHome',
    })
  },
  seeJd: function () {
    wx.redirectTo({
      url: '/page/Yuemall/pages/JDUnion/JDUnion',
    })
  },
  evaluate: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/evaluate/evaluate?recordid=' + e.currentTarget.dataset.orderno + '&productid=' + e.currentTarget.dataset.goodid + '&skuid=' + e.currentTarget.dataset.skuid + '&img=' + e.currentTarget.dataset.img,
    })
  },
  // 查看物流
  LogisticsInfo: function(e) {
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
  showModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  ConfirmReceipt: function(e) {
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
  del: function(e) {
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
  Repurchase: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  BuyAgain: function(e) {
    let that = this

    let {
      ismembergoods,
      orderson
    } = e.currentTarget.dataset

    post('/app/mall/order/goToPay', {
      type: 3,
      orderNo: orderson
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
            if (ismembergoods == 1) {
              wx.navigateTo({
                url: '/page/other/pages/PayResults/PayResults?orderNo=' + orderson + '&balance=balance&isSuccess=' + true + '&payType=0' + '&Mywinning=' + 'dalibao' + '&typePage=' + 'dalibao'
                //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
              })
            } else {
              wx.navigateBack()
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
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        isHaveMore: true
      })
    }
    if (this.data.currentTab == 0) {
      this.setData({
        orderType: 0,
        page: 1
      })
      this.wholelist()
    } else if (this.data.currentTab == 1) {
      this.setData({
        orderType: 1,
        page: 1
      })
      this.Otherlist()

    } else if (this.data.currentTab == 2) {
      this.setData({
        orderType: 2,
        page: 1
      })
      this.Otherlist()

    } else if (this.data.currentTab == 3) {
      this.setData({
        orderType: 3,
        page: 1
      })
      this.Otherlist()

    } else if (this.data.currentTab == 4) {
      this.setData({
        orderType: 6,
        page: 1
      })
      this.Otherlist()
    } else if (this.data.currentTab == 6) {
      this.setData({
        orderType: 6,
        page: 1
      })
      this.Otherlist()
    } else if (this.data.currentTab == 7) {
      this.setData({
        orderType: 7,
        page: 1
      })
      this.Otherlist()
    }
    // 售后
    else if (this.data.currentTab == 5) {
      console.log('3333')
      this.setData({
        page: 1
      })
      this.afterSale()
    }
  },
  // pdd列表
  swichNavPdd: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTabPdd == cur) {
      return false;
    } else {
      this.setData({
        currentTabPdd: cur,
        isHaveMorePddd: true
      })
    }
    if (this.data.currentTabPdd == 0) {
      this.setData({
        type: 0,
        page: 1
      })
      this.pddList()
    } else if (this.data.currentTabPdd == 1) {
      this.setData({
        type: 1,
        page: 1
      })
      this.pddList()
    } else if (this.data.currentTabPdd == 2) {
      this.setData({
        type: 2,
        page: 1
      })
      this.pddList()
    } 
  },
  // jd列表
  swichNavJd: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTabJd == cur) {
      return false;
    } else {
      this.setData({
        currentTabJd: cur,
        isHaveMoreJd: true
      })
    }
    if (this.data.currentTabJd == 0) {
      console.log('cccccccccc')
      this.setData({
        status: -1,
        page: 1
      })
      this.jdList()
    } else if (this.data.currentTabJd == 1) {
      this.setData({
        status: 0,
        page: 1
      })
      this.jdList()
    } else if (this.data.currentTabJd == 2) {
      this.setData({
        status: 1,
        page: 1
      })
      this.jdList()
    }
  },
  goPddDetail:function(e){
    console.log(e)
    // var goodsId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/Yuemall/pages/pddDetails/details?goodsId=' + e.currentTarget.dataset.id
    })
  },
  goJdDetail: function (e) {
    console.log(e)
    // var goodsId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/Yuemall/pages/JDUnionDetail/JDUnionDetail?goods_id=' + e.currentTarget.dataset.id
    })
  },
  // 售后列表
  afterSale: function() {
    let that = this
    post('/app/member/refundGoodsList', {
      page: 1,
      pageSize: that.data.pageSize
    }, (res) => {
      console.log(res, '=======')
      if (res.data.code == 200) {
        that.setData({
          AfterSale: res.data.list,
          page: that.data.page + 1
        })
        console.log(res.data.AfterSale)
      }
    }, 1, that.data.token, true, that.data.uid)
  },
  orderDetails: function(e) {
    if (e.currentTarget.dataset.type == 'service') {
      if (e.currentTarget.dataset.state == 0) {
        wx.navigateTo({
          url: '../NeworderDetails/NeworderDetails?orderSon=' + e.currentTarget.dataset.orderson + '&type=service',
        })
      } else {
        wx.navigateTo({
          url: '/page/Yuemall/pages/RefundExamine/RefundExamine?ordersn=' + e.currentTarget.dataset.orderson+'&changes='+wx.getStorageSync('changes'),
        })
      }

    } else {
      wx.navigateTo({
        url: '../NeworderDetails/NeworderDetails?orderSon=' + e.currentTarget.dataset.orderson + '&type=',
      })
    }
  },
  onUnload: function() {
    if (this.data.balance == 'balance') {
      wx.navigateBack({
        delta: 2
      })
    }
  },
  // 全部订单
  wholelist: function() {
    let that = this
    post('/app/member/mallOrderListVersion', {
      page: 1,
      pageSize: that.data.pageSize,
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          wholelist: res.data.list,
          page: that.data.page + 1
        })

      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 其他订单
  Otherlist: function() {
    let that = this
    console.log(that.data.orderType)
    if (!that.data.orderType) {
      that.setData({
        orderType: 0
      })
    }
    post('/app/member/mallOrderTypeListVersionTwo', {
      page: 1,
      pageSize: that.data.pageSize,
      orderType: that.data.orderType
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          list: res.data.list,
          page: that.data.page + 1
        })
        console.log(res.data.list)
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 拼多多订单
  pddList: function () {
    let that = this
    post('/pdd/v1/queryOrderList', {
      mid: wx.getStorageSync('uid'),
      page: 1,
      page_size: that.data.page_size,
      type: that.data.type
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          doc: res.data.data.doc,
          page: that.data.page + 1
        })
        console.log(res.data.data.doc.length)
      } else {

      }
    }, 1, that.data.token, true, that.data.uid,6)
  },
  // Jd订单
  jdList: function () {
    let that = this
    post('/open/jd/getOrderList', {
      mid: wx.getStorageSync('uid'),
      // mid: 111,
      status: that.data.status,
      page: 1,
      pageSize: 10,
    }, (res) => {
      console.log(res,res.data)
      if (res.data.code == 200 ) {
        that.setData({
          jdData: res.data.data,
          page: that.data.page + 1
        })
        console.log(res.data.data.length, this.data.jdData)
      } else {

      }
    }, 1, that.data.token, true, that.data.uid, 6)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    if (that.data.tabStatus == 0){
      if (that.data.currentTab == 0) {
        if (this.data.isHaveMore) {
          post('/app/member/mallOrderListVersion', {
            page: that.data.page,
            pageSize: that.data.pageSize,
          }, (res) => {
            if (res.data.code == 200) {
              that.setData({
                wholelist: that.data.wholelist.concat(res.data.list),
                page: res.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
                isHaveMore: res.data.list.length > 0 ? true : false
              })
            } else {

            }
          }, 1, that.data.token, true, that.data.uid)
        } else {
          wx.showToast({
            title: '没有更多了！',
            icon: 'none'
          })
        }
      } else if (that.data.currentTab == 5) {
        if (this.data.isHaveMore) {
          post('/app/member/refundGoodsList', {
            page: that.data.page,
            pageSize: that.data.pageSize
          }, (res) => {
            console.log(res, '=======')
            if (res.data.code == 200) {
              that.setData({
                // AfterSale: res.data.list,
                // page: that.data.page + 1
                AfterSale: that.data.AfterSale.concat(res.data.list),
                page: res.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
                isHaveMore: res.data.list.length > 0 ? true : false
              })
              console.log(res.data.list)

            }
          }, 1, that.data.token, true, that.data.uid)

        } else {
          wx.showToast({
            title: '没有更多了！',
            icon: 'none'
          })
        }

      } else {
        if (this.data.isHaveMore) {
          post('/app/member/mallOrderTypeListVersionOne', {
            page: that.data.page,
            pageSize: that.data.pageSize,
            orderType: that.data.orderType
          }, (res) => {
            if (res.data.code == 200) {
              that.setData({
                list: that.data.list.concat(res.data.list),
                page: res.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
                isHaveMore: res.data.list.length > 0 ? true : false
              })
            } else {
              
            }
          }, 1, that.data.token, true, that.data.uid)
        } else {
          wx.showToast({
            title: '没有更多了！',
            icon: 'none'
          })
        }
      }
    } else if (that.data.tabStatus == 1 ){
      if (this.data.isHaveMorePddd) {
        post('/pdd/v1/queryOrderList', {
          mid: wx.getStorageSync('uid'),
          page: that.data.page,
          page_size: that.data.page_size,
          type: that.data.type
        }, (res) => {
          if (res.data.code == 200) {
            that.setData({
              doc: that.data.doc.concat(res.data.data.doc),
              page: res.data.data.doc.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMorePddd: res.data.data.doc.length > 0 ? true : false
            })
          } else {

          }
        }, 1, that.data.token, true, that.data.uid, 6)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    } else if(that.data.tabStatus == 2){
      if (this.data.isHaveMoreJd) {
        post('/open/jd/getOrderList', {
          mid: wx.getStorageSync('uid'),
          status: that.data.status,
          page: that.data.page,
          pageSize: 10,
        }, (res) => {
          if (res.data.code == 200) {
            that.setData({
              jdData: that.data.jdData.concat(res.data.data),
              page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMoreJd: res.data.data.length > 0 ? true : false
            })
          } else {

          }
        }, 1, that.data.token, true, that.data.uid, 6)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    }
  },
  onPullDownRefresh: function() {

  },
  onShow: function() {
    // let that = this
    // that.setData({
    //   page:1
    // })
    // if (that.data.currentTab == 5) {
    //   that.afterSale()
    // }
  }
})