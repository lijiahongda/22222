import {
  get,
  post
} from '../../../../utils/util.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false, //弹窗状态,
    cartId: '',
    receiverName: '',
    mobile: '',
    address: '',
    totelPrice: '',
    couponList: [],
    DiscountAmount: '',
    actualPrice: '',
    totelPrice: '',
    isAble: 0,
    couponid: '',
    addressId: '',
    isDefault: 0,
    Able: 0,
    addressAdministration: '',
    labelName: '',
    addressType: 0,
    addressIds: 0,
    areaid: 0,
    ispay: '',
    isgopay: true,
    address: '',
    cardType:1,
    confirmSiteType:0, // 收货地址确认弹窗;0-未更改地址、1-已更改过地址
    confirmSiteShow:false, // 显示收货地址弹窗
    userMsg:'',
    balanceMoney:'',
    baMoney:'',
    alertChoseShow:false,
    // 支付类型下标
    typeIndex:'1'
  },
  // 显示收货弹窗
  confirmSite(){
    this.setData({
      confirmSiteShow: true,
      confirmSiteType: 1
    })
  },
  // 加入会员
  join: function (e) {
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },
  // 初始化数据 -- 入口抢购详情
  RushBuy: function () {
    let that = this
    if (that.data.labelName == undefined || that.data.labelName == 'undefined') {
      that.setData({
        labelName: ''
      })
    }
    post('/mall/flashBalanceNew', {
      goodsNum: that.data.goodsnum,
      goodsId: that.data.goodid,
      uid: that.data.uid,
      activityId: that.data.activityId,
      areaId: that.data.areaid,
      skuId: that.data.skuid
    }, (res) => {
      if (res.data.code == 200) {
        let list = res.data.data
        that.setData({
          list: list,
          totelPrice: list.goodsTotalprice,    //金额
          productInfo: list.productInfo,
          actualPrice: list.totalPrice,
          isDefault: list.areaInfo.is_default,
          totalFreight: list.goodsFreight,   //运费
          address: res.data.data.areaInfo,
          balanceMoney: res.data.data.balanceMoney,  //余额
          baMoney: (list.goodsFreight + res.data.data.goodsTotalprice).toFixed(2)
        })
        // 当前配送地址不支持送货
        if (list.isFilterGoods == 1) {
          wx.showToast({
            title: list.isFilterGoodsText,
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 3000)
        }
       
      } else if (res.data.code == 400) {
        if (that.data.goodid == 450336) {
          wx.showToast({
            title: '仅非会员可购买此商品',
            icon: 'none',
            duration: 2200
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 10000
          });
        }
        setTimeout(function () {
          wx.navigateBack()
        }, 6000)
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },

  // 支付
  payment: function () {
    let that = this
    // if (that.data.confirmSiteType==0){
    //   that.confirmSite()
    //   return
    // }
    wx.showLoading({
      title: '支付中',
    });
    that.setData({ isgopay:false})
    console.log(that.data.address.addressId, 'addressId')
    post('/mall/createFlashOrderNew', {
      goodsId: that.data.goodid,
      skuId: that.data.skuid,
      uid: that.data.uid,
      areaId: that.data.address.addressId,
      goodsNum: that.data.goodsnum,
      version:2,
      activityId: that.data.activityId,
      orderFrom:7,
      shareId: wx.getStorageSync('ortherReCode'),
      isHadBalance:1,
      room_id:that.data.room_id,
      share_form:app.globalData.shareForm,
      position_from:app.globalData.positionFrom
    }, (res) => {
      console.log(res)
      that.setData({
        ordersn: res.data.ordersn
      })

      if(this.data.typeIndex=='1'){
        post('/app/newMallPay', {
          ordersn: res.data.ordersn,
          type: 3
        }, (res) => {
          if (res.data.code == 200) {
            wx.hideLoading()
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
              
                wx.redirectTo({
                  url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + true + '&payType=0',
                  //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
                })
              },
              'fail': function (res) {
                wx.hideLoading()
                that.setData({ isgopay: true })
                let type = ''
                if (that.data.type == 0) {
                  type = 'miaosha'
                } else if (that.data.type == 1) {
                  type = 'banjia'
                }
                console.log(type)
                wx.redirectTo({
                  url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + false + '&payType=0' + '&malltype=' + type,
                  //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
                })
              },
            })
          }
        }, 1, that.data.token, true, that.data.uid)
      }else{
        if(res.data.isHasPayWord == 1){
          wx.showToast({
            title: '请先到我的钱包-消费余额中设置密码',
            icon: 'none',
            duration: 5000
          });
          this.setData({
            isgopay: true,
            alertChoseShow: false,
          })
          return
        }
        this.setData({
          alertShow: true,
          alertChoseShow: false,
          isgopay: true
        })
        wx.hideLoading()
      }

    }, 1, that.data.token, true, that.data.uid, 4)
  },
  // 添加地址
  addressAdministration: function () {
    wx.navigateTo({
      url: '../addressAdministration/addressAdministration?Mywinning=' +'datilAss',
    })
  },
  // 显示弹窗
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
  // 隐藏弹窗
  hideModal: function () {
    this.setData({
      showModalStatus: false
    })
    // 隐藏遮罩层
    this.setData({
      showModalStatus: false,
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options, '结算options')
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      goodid: options.goodid,
      skuid: options.skuid,
      areaid: options.areaid,
      goodsnum: options.goodsnum,
      Entrance: options.Entrance,
      activityId: options.activityId,
      type:options.type,
      cardType: wx.getStorageSync('cardType'),
      room_id:options.room_id?options.room_id:0
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.RushBuy()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // 点击修改密码
  updatePassword() {
    this.setData({
      alertShow: true,
      comIndex: 0
    })
    // 调用子级的倒计时
    this.selectComponent('#myCode').countdownFun()
  },
  // 关闭弹窗事件
  closeAlert() {
    this.setData({
      alertShow: false
    })
  },
  
  // 开始转入
  intoStart(e) {
    let that = this
    post('/app/mall/order/balancePay', {
      "orderNo": this.data.ordersn,  //订单
      "word": this.data.password //密码
    }, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        wx.showToast({
          title: '支付成功',
          icon: 'none'
        })
        wx.hideLoading()
        wx.redirectTo({
          url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + true + '&payType=0',
          //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        if (res.data.msg =='密码错误'){
          return
        }
        that.setData({ isgopay: true })
        let type = ''
        if (that.data.type == 0) {
          type = 'miaosha'
        } else if (that.data.type == 1) {
          type = 'banjia'
        }
        console.log(type)
        wx.redirectTo({
          url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + false + '&payType=0' + '&malltype=' + type,
          //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1,'aes')
  },
  // 右上角关闭
  closeMyself() {
    this.setData({
      alertShow: false
    })
  },
  // 下一步
  nextAlert() {
    if (this.data.password.length != 6) {
      wx.showToast({
        title: '请输入6位密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '支付中',
    });
    this.intoStart()
    // this.triggerEvent('into', this.data.password)
    // this.triggerEvent('nextCom', 2)
  },
  // 输入密码
  setPsw(e) {
    this.setData({
      password: e.detail.value
    })
  },
  closeTypeAlert(){
    this.setData({
      alertChoseShow:false,
      isgopay:true
    })
  },
  // 去支付
  toPay(){
    wx.hideLoading()
    if (this.data.confirmSiteType==0){
      this.confirmSite()
      return
    }
    this.setData({
      alertChoseShow: true,
      confirmSiteShow:false
    })
  },
  // 
  choseType(e){
    var index = e.currentTarget.dataset.index
    console.log(this.data.balanceMoney > this.data.baMoney)
    if (this.data.balanceMoney*1 < this.data.baMoney*1&&index=='2'){
      wx.showToast({
        title: '余额不足，请选择其他支付方式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      typeIndex:index
    })
  },
  // 关闭地址弹窗
  closeConfirm(){
    this.setData({
      confirmSiteShow:false
    })
  }
 
})