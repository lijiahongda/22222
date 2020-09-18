import {
  get,
  post
} from '../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    saveMoney: 0,
    push: 0,
    leftCardNum:0,
    LoadingStatus: false,
    orderData: [],
    longin: true,
    Nolongin: false,
    showModalStatus: false,
    showModal: false,
    name: '',
    cardType: '',
    coin: 0,
    coupon: 0,
    cardImg: '',
    unlock: '',
    reveal: 1,
    balance: 0,
    uid: '',
    token: '',
    screenHeight: '0',
    authorizationStatus: true,
    page: 1,
    pageSize: 10
  },
  // 平台客服
  CustomerService:function(){
    // wx.makePhoneCall({
    //   phoneNumber: '400 110 9600' 
    // })
   
  },
  // 物流详情
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
  // 我要创业
  PartTimeJob:function(){
    this.goMemberCenter()
    // wx.navigateTo({
    //   url: '/page/yueMember/pages/personJob/personJob'
    // })
  },
  // 手机号验证码
  VerificationCode: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  group(){
    wx.navigateTo({
      url: '/page/community/pages/myGroup/myGroup'
    })
  },
  addressBook() {
    wx.navigateTo({
      url: '/page/community/pages/myAddressBook/myAddressBook'
    })
  },
  // 分类列表
  classificationList: function(e) {
    app.classificationList(e, this)
  },
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
  // 我的店铺
  personalStores: function() {
    wx.navigateTo({
      url: '/page/yueMember/pages/personalStores/personalStores'
    })
  },
  NethongVilla: function() {
    wx.navigateTo({
      url: '/page/yueMember/pages/NethongVilla/NethongVilla'
    })
  },
  // 领券中心
  CouponCenter: function() {
    wx.navigateTo({
      url: '/page/yueMember/pages/CouponCenter/CouponCenter?activityId=' + this.data.couponActivityId,
    })
  },
  // 积分商城
  IntegralMall: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMall/IntegralMall',
    })
  },
  // 部分功能页面
  Partner: function(e) {
    wx.navigateTo({
      url: '/page/oneself/pages/FunctionIntroduction/FunctionIntroduction?type=' + e.currentTarget.dataset.type + '&MyreCode=' + this.data.MyreCode,
    })
  },
  // 免费游
  msg: function() {
    wx.navigateTo({
      url: '/page/other/pages/YueNews/YueNews',
    })
  },
  // 电话
  calltel: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  // 每日抽奖
  LuckDraw: function() {
    wx.navigateTo({
      url: '/page/other/pages/LuckDraw/LuckDraw',
    })
  },
  // 使用说明
  Instructions: function() {
    wx.navigateTo({
      url: '/page/oneself/pages/Instructions/Instructions?sale=' + JSON.stringify(this.data.sale),
    })
  },
  // 会员升级
  join: function() {
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },
  // 悦旅大人
  adults: function() {
    wx.navigateToMiniProgram({
      appId: 'wx3b5c2af451998243',
      path: '',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  // 我的消费抽奖码
  utourletLuckyDraw: function() {
    wx.navigateTo({
      url: '/page/other/pages/utourletLuckyDraw/utourletLuckyDraw',
    })
  },
  // 佣金
  myWalletContent: function() {
    if (this.data.uid == "" || this.data.token == "") return;
    else {
      wx.navigateTo({
        url: '/page/oneself/pages/myWalletContent/myWalletContent',
      })
    }
  },
  // 新版商城
  NewmallOrder: function(e) {
    // wx.navigateTo({
    //   url: '/page/Yuemall/pages/NeworderList/NeworderList?cur=' + e.currentTarget.dataset.cur
    // })
    wx.showToast({
      title: '请下载"悦淘App"进行查看',
      icon: 'none'
    })
  },
  // 500券
  lineDrtail: function(e) {
    wx.navigateTo({
      url: '/page/hotel/pages/DiscountRoom/DiscountRoom?id=' + 33,
    })
  },
  // 我的二维码
  QRCode: function() {
    wx.navigateTo({
      url: '/page/oneself/pages/shareCode/shareCode',
    })
  },
  //我的收藏
  MyCollection: function() {
    if (wx.getStorageSync('isBinding') == 2) {
      wx.navigateTo({
        url: '/page/Mall/YueMall'
      })
      return;
    }
    wx.navigateTo({
      url: '/page/oneself/pages/MemberCenter/MemberCenter?isCollection=' + '1',
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
    // 隐藏遮罩层
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
  ApplyForCard: function() {
    if (this.data.uid == "" || this.data.token == "") {
      return;
    }
    if (this.data.data.hasCreditCard == 1) {
      wx.showToast({
        title: '民生银行信用卡申请审核中！',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: '../ApplyForCard/pages/ApplyForCard/ApplyForCard',
      })
    }

  },
  CardVolume: function() { //卡券
    if (this.data.uid == "" || this.data.token == "") {
      return;
    }
    wx.navigateTo({
      url: '../CardVolume/pages/CardVolume/CardVolume',
    })
  },

  MyParticulars: function() {
    if (this.data.uid == "" || this.data.token == "") {
      return;
    }
    wx.navigateTo({
      url: '../CardVolume/pages/particulars/particulars'
      // ?id=' + id 
    })
  },
  goMemberInformation: function() {
    if (this.data.uid == "" || this.data.token == "") {
      return;
    }
    wx.navigateTo({
      url: '../oneself/pages/memberInformation/memberInformation'
      // ?id=' + id 
    })
  },
  StandardYearCard: function() {
    if (this.data.uid == "" || this.data.token == "") {
      return;
    }
    wx.navigateTo({
      url: '../CardVolume/pages/touristCard/touristCard'
      // ?id=' + id 
    })
  },
  goMemberCenter: function() {

    // wx.navigateTo({
    //   url: '../oneself/pages/MemberCenter/MemberCenter'
    // })
    wx.showToast({
      title: '请下载"悦淘App"进行查看',
      icon: 'none'
    })
  },
  goEntityCard: function(e) {
    if (this.data.uid == "" || this.data.token == "") {
      return;
    }
    // var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../oneself/pages/EntityCard/EntityCard'
      // ?id=' + id 
    })
  },
  goinviteFriends: function(e) {
    if (this.data.uid == "" || this.data.token == "") {
      return;
    }
    // var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../oneself/pages/inviteFriends/inviteFriends'
      // ?id=' + id 
    })
  },
  lookDetail: function(e) {
    wx.navigateTo({
      url: '/page/yueMember/pages/GiftPackage/GiftPackage'
    })
  },
  getOrderList: function(uid, token) {
    var that = this;
    console.log(uid)
    console.log(token)
    that.setData({
      LoadingStatus: true
    })
    get('/app/member/v3/newGet/', {}, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        that.setData({
          ad: res.data.data.ad2,
          MyreCode: res.data.data.reCode,
          sale: res.data.data.sale,
          data: res.data,
          name: res.data.data.name,
          cardType: res.data.cardType,
          levelText: res.data.data.levelText,
          coin: res.data.data.ico,
          coupon: res.data.data.coupon,
          cardImg: res.data.data.avatar,
          balance: res.data.data.balance,
          hasFiveHundred: res.data.data.hasFiveHundred,
          activePic: res.data.data.activePic,
          adDisplay: res.data.data.adDisplay,
          couponActivityId: res.data.data.couponActivityId,
          reCode: res.data.data.reCode,
          adListNew: res.data.data.adListNew,
          adList: res.data.data.adYear,
          saveMoney: res.data.data.saveMoney,
          leftCardNum: res.data.data.leftCardNum,
          push: res.data.data.push,
          list: res.data.data.giftPackage,
          orderCount: res.data.data.orderCount  
        })
        that.setData({
          LoadingStatus: false
        })
      } else {
        that.setData({
          LoadingStatus: false
        })
      }
    }, 1, token, true, uid)
    get('/api/item/msg?uid=' + uid + '&type=' + 2, {}, (res) => {
      if (res.data.code == 200) {
        this.setData({
          msg: res.data.data.msg
        })
      }
    }, 1, token, true, uid, 2);
    post('/app/member/centerExpress', {}, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        if (res.data.data !='') {
          that.setData({
            iscenterExpress: res.data.data,
            expressInfo: res.data.data.expressInfo[0],
            goodsImg: res.data.data.goodsImg,
            recordId: res.data.data.recordId,
            goodsName: res.data.data.goodsName,
            goodsNum: res.data.data.goodsNum,
            goodsSpec: res.data.data.goodsSpec,
            goodsPrice: res.data.data.goodsPrice
          })
        }
      }
    }, 1, token, true, uid);
  },
  recharge: function() {
    // wx:wx.navigateTo({
    //   url: '',
    // })
    this.setData({
      showModal: false,
    })
  },
  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'unlock',
      success: function(res) {
        that.setData({
          unlock: res.data
        })
      }
    })
    wx.setStorageSync('myrequest', 'myrequest');
    if (that.data.unlock == 1 && that.data.reveal == 1) {
      that.setData({
        showModal: true,
        reveal: 2
      })
    } else {
      that.setData({
        showModal: false
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenHeight: (res.screenHeight - 750)
        })
      },
    })
  },
  // onPullDownRefresh: function() {
  //   this.getOrderList();
  //   wx.stopPullDownRefresh();
  // },
  onShow: function() {
    var that = this
    wx.getStorage({
      key: 'unlock',
      success: function(res) {
        that.setData({
          unlock: res.data
        })
      }
    })

    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      isBinding: wx.getStorageSync('isBinding'),
      userType: wx.getStorageSync('cardType')
    })
    console.log(wx.getStorageSync('uid'))
    that.setData({
      typeCrad: wx.getStorageSync('cardType')
    })
    // wx.clearStorage('uid')
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false
      })
      console.log(wx.getStorageSync('myrequest'))
      if (wx.getStorageSync('myrequest') == 'myrequest') {
        this.getOrderList(wx.getStorageSync('uid'), wx.getStorageSync('token'));
      }
    } else {
      if (wx.getStorageSync('myrequest') == 'myrequest') {
        this.getOrderList(wx.getStorageSync('uid'), wx.getStorageSync('token'));
      }
    }
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    wx.setStorageSync('isarticle', false)

  },
  bindLogin: function() {
    wx.switchTab({
      url: '/page/Mall/YueMall'
    })
  }
})