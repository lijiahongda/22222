// page/Yuemall/pages/IntegralMall/IntegralMall.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    isHaveMore:true,
    authorizationStatus:false
  },
  
  // 商品列表  
  retypeData: function() {
    let that = this
    let uid = 0
    if (wx.getStorageSync('uid')){
      uid = wx.getStorageSync('uid')
    }else{
      uid = 0
    }
    wx.showLoading()
    post('/mall/integral/getIntegralList', {
      uid:wx.getStorageSync('uid')
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          travel: res.data.data.travel,
          life: res.data.data.life,
          coinInfo: res.data.data.coinInfo,
          shareTitle: res.data.data.shareTitle,
          shareImg: res.data.data.shareImg
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
      wx.hideLoading()
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  details: function(e) {
    console.log(e)
    // return
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMallDatail/IntegralMallDatail?goodsId=' + e.currentTarget.dataset.goodsid + '&parentTypeId=' + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.retypeData()
  },

  // 豆
  bean:function(e){
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMallBean/IntegralMallBean?type='+e.currentTarget.dataset.type+'&num='+e.currentTarget.dataset.num,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
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
      if (wx.getStorageSync('mapId')) {
        //说明已经授权，去绑定
        console.log('说明已经授权，去绑定======')
        that.setData({
          authorizationStatus: true
        })
      } else {
        //还未授权，去授权
        console.log('还未授权，去授权')
        that.setData({
          authorizationStatus: true
        })
      }
    }
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
  },
 
  onShareAppMessage: function () {
    let that = this
    let nickname = wx.getStorageSync('nickname');
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route;
    var options = currentPage.options;
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')
    } catch (e) {

    }
    return {
      title: that.data.shareTitle,
      imageUrl: that.data.shareImg,
      path: "page/Yuemall/pages/IntegralMall/IntegralMall" + "?reCode=" + value
    }
  }
})