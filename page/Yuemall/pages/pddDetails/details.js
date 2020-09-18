import {
  get,
  post,
  relations,
  retrunScene,
} from '../../../../utils/util.js';
import WxParse from "../../../../wxParse/wxParse/wxParse.js"
var app = getApp();
var timer = require('../../../../utils/wxTimer-master/wxTimer.js')
// var app = getApp().globalData
var glo = app.globalData
timer = glo.timer;
var wxTimer1;
var previewOnshow; // 解决图片预览 出发onshow
Page({
  /**
   * 页面的初始数据
   */
  
  data: {
    danmuList:false,
    isPlay:false,
    isFill: false,
    three: 5,
    imagenum: 20,
    scrollTop: 0,
    scrollId: '', //选中ID
    tabIndex: 0,
    lineText: [{
        title: '宝贝'
      }, {
        title: '评论'
      },
      {
        title: '发圈素材'
      }, {
        title: '详情'
      }
    ],
    productType: 0,
    sureId: 0,
    Share: true,
    gopay: false,
    wxTimer: '',
    wxTimerSecond: '',
    wxTimerList: {},
    time: '00:00:10',
    isRushBuy: '距开抢时间',
    orderData: [],
    addressCode: 0,
    uid: '',
    token: '',
    codeNumber: '',
    bannerItem: [],
    showModalStatus: false, //弹窗状态
    showModal: false,
    selectLabel: '请选择规格',
    selectNum: '数量',
    mobile: '',
    label: [{
        name: '2.0kg/份',
        index: 1
      },
      {
        name: '4.0kg/份',
        index: 2
      }
    ],
    isaddress: false,
    amountNumber: 1,
    shoppingCartNumber: '',
    Tab: 0,
    title: '',
    moneyPrice: '266.20',
    image: '../../../../images/YueMall/banner.jpg',
    labelName: '',
    goodsId: '',
    goodDesc: '',
    goodPrice: '',
    vipPrice: '',
    cardType: '',
    current: 0,
    sharelayer: false,
    notBuyMessage: '', //想买这个东西,分人
    sizeSelectText: [],
    colorSize: [],
    statusArr: [], //各行规格默认选中项
    selectedSku: [], //选中sku的列表
    authorizationStatus: false, //授权按钮状态
    isDisplayFulltext: false,
    islimitInfo: false,
    realName: false, //是否实名
    channelIcon:'',
    canSend:0, // 是否白拿
  },
  PDDClick(e){
    console.log(e)
    wx.navigateTo({
      url: '/page/Yuemall/pages/GrowthDetails/GrowthDetails',
    })
   },
  sharePage: function () {
    wx.navigateTo({
      url: '/page/other/pages/CommoditySharing/CommoditySharing?goodsid=' + this.data.goodsId + '&Entrance=' + 'pdd' + '&bannerItem=' + JSON.stringify(this.data.bannerItem) + '&amount=' + this.data.coupon[0].coupon_discount + '&price=' + this.data.min_normal_price + '&goodsName=' + this.data.title + '&vipPrice=' + this.data.jh_price + '&saleCount=' + this.data.sales_tip
    })
  },
  amountNumberInput: function(e) {
    this.setData({
      amountNumber: e.detail.value
    })
  },
  goPdd:function(){
    let that = this
    wx.navigateToMiniProgram({
      appId: 'wx32540bd863b27570',
      path: that.data.page_path,
      extraData: {

      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  

  
  // // 查看更多评论
  // lookComment: function() {
  //   wx.navigateTo({
  //     url: '/page/Yuemall/pages/lookComment/lookComment?productid=' + this.data.goodsId,
  //   })
  // },
  /**
   * 页面滑动
   */
  bindscroll: function(e) {
    let data = this.data
    let scrollTop = e.scrollTop
    this.setData({
      scrollTop: e.detail.scrollTop
    })
    if (e.detail.scrollTop > 100) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#CA2519',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
    if (e.detail.scrollTop == 0) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
  },
  // 手机号验证码
  VerificationCode: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  // 销毁页面
  onUnload: function() {
    if (this.data.success == 'success') {
      wx.navigateBack({
        delta: 2
      })
    }
    wxTimer1 = null
  },
  // 图片点击事件
  imgYu: function(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    previewOnshow = true; //解决图片预览出发onshow
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
 
  // 轮播 点击事件
  bindChange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
 

  detail: function(e) {
    console.log(e.detail)
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.detail.data.goodsid + '&skuid=' + e.detail.data.skuid
    })
  },
  // 播放视频
  PlayVideo:function(){
    this.setData({
      isPlay:true
    })
  },
  // 关闭视频
  closePlay:function(){
    this.setData({
      isPlay:false
    })
  },
  // 加载数据
  getOrderList: function() {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    let obj = {
      goods_id: Number(that.data.goodsId) ,
      uid: wx.getStorageSync('uid'),
      channel_id:98,
      type:3
    }

    if (that.data.video == 'video') {
      obj.fromBy = 1 //1=>带货视频 0=>默认
    }

    post('/outside/pddGoodsInfo', obj, (res) => {
      if (res.data.code == 200) {
        if(res.data.data.length==0){
          wx.showToast({
            title: '商品已下架',
            icon:'none',
            duration:2000,
            success:function(){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1,
                })
              },2000)
            }
          })
        }
        wx.hideLoading()
        that.setData({
          bannerItem: res.data.data.info.goods_gallery_urls,
          title: res.data.data.info.goods_name,
          jh_price: res.data.data.info.jh_price,
          min_normal_price: res.data.data.info.min_normal_price,
          sales_tip: res.data.data.info.sales_tip,
          tk: res.data.data.info.tk,
          zg: res.data.data.info.zg,
          coupon: res.data.data.coupon,
          mall_name: res.data.data.mall_info.mall_name,
          desc_txt: res.data.data.mall_info.desc_txt,//宝贝描述
          serv_txt: res.data.data.mall_info.serv_txt,//卖家服务
          lgst_txt: res.data.data.mall_info.lgst_txt,//物流服务
          page_path: res.data.data.xcx_jump,
          newShareScore:res.data.data.newShareScore,
        })
        console.log(that.data.colorSize,'colorSize')
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  
  // 未实名 点击确认
  closeRealName: function() {
    this.setData({
      realName: false
    })
    this.hideModal()
  },
  
  //禁止滑动  
  disMove: function() {

  },

  onLoad: function(options) {
    let that = this
    let scene = '';
    let reCode = '';
    let goodsId = '';
    let Modeliphonex = 'iPhone X'
    let ModeliphonePro = 'iPhone Pro'
    
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        reCode = sceneObj.C;
        goodsId = sceneObj.I;
      });
    } else {
      reCode = options.reCode;
      goodsId = options.goodsId;
    }
    console.log(options, 'option')
    that.setData({
      goodsId: goodsId,
      leaderId: options.leaderId,
      isLeader: options.isLeader,
      lng: wx.getStorageSync('lng'),
      lat: wx.getStorageSync('lat'),
      activityId: options.activityId,
      video: options.video, //判断是否是从视频进入的  video是
    })
    this.getUrl()
    //取自己的邀请码
    wx.getStorage({
      key: 'reCode',
      success: function(res) {
        that.setData({
          reCode: res.data
        })
      }
    })

    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      RushBuy: options.RushBuy,
      success: options.success,
      isFree: options.isFree
    })
    
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
        console.log(res.model)
        if (res.model.indexOf(Modeliphonex) > -1 || res.model.indexOf(ModeliphonePro) > -1) {
          console.log('---')
          that.setData({
            isFill: true
          })
        }
      }
    })
  },
  getUrl:function(){
    let that = this
    post('/pdd/v1/queryGoodsClick', {
      mid: wx.getStorageSync('uid'),
      id: that.data.goodsId,
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          page_path: res.data.data.we_app_info.page_path,
          app_id: res.data.data.we_app_info.app_id
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid, 6)
  },
  onPullDownRefresh: function() {

  },

  onShow: function() {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    // this.initSelected(this.data.colorSize, '100000942707')
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      selectLabel: '请选择规格',
      selectNum: '数量',
      amountNumber: 1
    })
    wx.getStorageSync('selfReCode')
    if (that.data.isaddress == false) {
      that.getOrderList()
    }
    let interval = setInterval(function() {
      let m = new Date().getMinutes();
      if (m = 0) {
        that.getOrderList()
      }
    }, 60000)
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    // wx.clearStorage('mapId')
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
      that.setData({
        authorizationStatus: true
      })
    }
    console.log(wx.getStorageSync('ortherReCode') + '分享者id')
    let ortherRecode = wx.getStorageSync('ortherReCode') ? wx.getStorageSync('ortherReCode') : 0
    get('/app/member/distribution/record/' + this.data.goodsId + '/' + ortherRecode + '/' + 2, {}, (res) => {
      console.log(res)
      if (res.data.code == 200) {} else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },
  postShareImg: function(goodid, _this) {
    /**
     * 注释 注释 注释！！！！！！！！！
     * 取分享图片
     * 说明
     * url = /getsaleimg
     * type	line/hotel
     * id	type为line时传 线路id,type为hotel时传酒店id
     * prices	现价
     * priced	原价
     * preferential	优惠信息（非必传）
     * cover	活动封面地址
     */


    post('/share/MallProductShare', {
      product_sku_id: _this.data.skuid,
      product_id: goodid

    }, (res) => { // 获取分享图片 ajax

      if (res.data.code == 200) {
        _this.sharePostUrl = res.data.img;
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4);
  },
  // 首页
  gohome: function() {
    wx.switchTab({
      url: "/page/Mall/YueMall",
    })
  },
  // 页面内分享
  // onShare: function() {
  //   if (wx.getStorageSync('uid')) {
  //     this.setData({
  //       sharelayer: true
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
  //     })
  //   }
  // },
 
  /**
   * 初始化默认选中项
   */
  initSelected: function(colorsize, skuid) {
    let arr = new Array(colorsize.length)
    for (let i = 0; i < colorsize.length; i++) {
      for (let j = 0; j < colorsize[i].buttons.length; j++) {
        // colorsize[i].buttons[j].isEnable = true
        if (colorsize[i].buttons[j].skuList.indexOf(Number(skuid)) > -1) {
          // this.data.statusArr[i] = j
          this.selectLabel(i, j);
        }
      }
    }
  },
  in_array(stringToSearch, arrayToSearch) {
    for (var s = 0; s < arrayToSearch.length; s++) {
      var thisEntry = arrayToSearch[s].toString();
      if (thisEntry == stringToSearch) {
        return true;
      }
    }
    return false;
  }

})