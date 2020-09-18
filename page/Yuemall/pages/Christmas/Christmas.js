// page/Channel/Index/index.js
import {
  post,
  get,
  retrunScene,
  relations
} from '../../../../utils/util.js';
var app = getApp();
var previewOnshow; // 解决图片预览 出发onshow
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSmallRedPopup: true,
    backgroundColor: '#A2393E',
    indicatorDots: false,
    num: 1,
    page: 1,
    currentTab: 1,
    isHaveMore: true,
    dataList:{},
    list:[],
    shareImg:''
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    let that = this
    console.log('=======123')
    that.setData({
      LoadingStatus: true
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    wx.setStorageSync('myrequest', 'myrequest');
    if (previewOnshow) {
      previewOnshow = false;
      return;
    }
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    var lineDepartCity = wx.getStorageSync('lineDepartCity')
    if (lineDepartCity == '') {
      lineDepartCity = that.data.lineDepartCity;
      wx.setStorageSync('lineDepartCity', lineDepartCity);
    } else {
      that.setData({
        lineDepartCity: lineDepartCity,
      })
    }
    if (wx.getStorageSync('uid')) {
      //已经登陆
      console.log('已经登陆了')
      that.setData({
        isSmallRedPopup: false,
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
    }
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    if (wx.getStorageSync('christmas')){
      that.setData({
        page: 1,
        isHaveMore: true
      })
      that.initData()
      that.getList()
      // that.share()
    }
  },
  // share:function(){
  //   let that = this
  //   post('/share/christmasForward', {
  //     uid:wx.getStorageSync('uid')
  //   }, (res) => {
      
  //     if (res.data.code == 200) {
        
  //     } else {
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon: 'none'
  //       })
  //     }
  //   }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  // },
  join:function(){
    let that = this
    get('/mall/activity/christmas/exposure?type=1&universal_id=0', {}, (res) => {
      
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    // 打开大人小程序
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
  // 触摸屏幕收起红包
  mytouchstart: function(e) {
    console.log('触摸')
    this.setData({
      SmallRed: true
    })
  },
  // 松开屏幕出现红包
  mytouchmove: function(e) {
    console.log('松手')
    this.setData({
      SmallRed: false
    })
  },
  // 手机号验证码
  VerificationCode: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  // 线路
  details: function(e) {
    get('/mall/activity/christmas/exposure?type=3&universal_id=' + e.currentTarget.dataset.goodsid, {}, (res) => {

    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMallDatail/IntegralMallDatail?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  // 商品
  shopDetail:function(e){
    get('/mall/activity/christmas/exposure?type=2&universal_id=' + e.currentTarget.dataset.productid, {}, (res) => {

    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  initData: function() {
    let that = this
    get('/mall/activity/christmas/index', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          LoadingStatus: false,
          dataList:res.data.data,
          hotProduct: res.data.data.hotProduct,
          tourism: res.data.data.tourism,
          shareImg: res.data.data.shareImg
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  getList:function(){
    let that = this
    post('/website/home/seachPuls', {
      content:'圣诞',
      order_by:'sys',
      page:1,
      product_type: 5,
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data,
          LoadingStatus: false
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 3)
  },
  videoDetail:function(e){
    let that = this
    let item = e.currentTarget.dataset.item
    get('/mall/activity/christmas/exposure?type=3&universal_id=' + item.product_pk, {}, (res) => {

    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    wx.navigateTo({
      url: '/page/videoDetail/pages/detaiChristmas/detaiChristmas?id=' + item.product_pk,
    })
  },
  // 分享
  onShareAppMessage: function () {
    let that = this
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route;
    var options = currentPage.options;
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')
    } catch (e) {
      // Do something when catch error
    }
    console.log(value)
    
    return {
      imageUrl: that.data.shareImg,
      path: "page/Yuemall/pages/Christmas/Christmas" + "?reCode=" + value
    }
  },

 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    that.setData({
      LoadingStatus:true
    })
    that.data.page+=1
    post('/website/home/seachPuls', {
      content: '圣诞',
      order_by: 'sys',
      product_type:5,
      page: that.data.page
    }, (res) => {
      if (res.data.code == 200) {
        if (res.data.data.length){
          that.setData({
            list: that.data.list.concat(res.data.data),
            LoadingStatus: false
          })
        }else{
          wx.showToast({
            title: '没有更多了！',
            icon: 'none'
          })
          that.setData({
            LoadingStatus: false
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 3)

  }
})