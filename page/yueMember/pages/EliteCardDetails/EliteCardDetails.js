 import {
   get,
   post,
   relations
 } from '../../../../utils/util.js';

 Page({

   /**
    * 页面的初始数据
    */
   data: {
     uid: '',
     token: '',
     authorizationStatus: false
   },
   VerificationCode: function () {
     wx.navigateTo({
       url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
     })
   },
   click(e) {
     //7=购物省钱分享赚钱， 109=品牌折扣券，200=白拿，37=积分商城，59=酒店，46=生活充值，61=加油省钱，201=黑金专区，108=社群团购，202=培训师
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    var prevPage = pages[pages.length - 2]; 
    let url = currentPage.route;
    let options = currentPage.options;
     console.log(e, '0000000000000000000000000000000000')
     let id = e.currentTarget.dataset.id
     let that = this
     prevPage.setData({
      //直接给上移页面赋值
      hhh:700
    });
     //0-chakan,1-升级，1==开通
     if (id == 1) {
       wx.switchTab({
         url: '/page/EliteCard/EliteCard?windowHeight=200',
       })
       this.setData({
        windowHeight:200,
       })
     } else if (id == 0 && that.data.type == 204 || that.data.type == 203 ) {
       //品牌折扣券 =》优惠券列表
       wx.navigateTo({
         url: '/page/CardVolume/pages/CardVolume/CardVolume',
       })
     } else if (id == 0 && that.data.type == 200) {
       //白拿
       wx.navigateTo({
         url: '/page/Yuemall/pages/NewHotStyle/NewHotStyle?id=55',
       })
     } else if (id == 0 && that.data.type == 7) {
       //首页
       wx.navigateTo({
         url: '/page/Mall/YueMall',
       })
     } else if (id == 0 && that.data.type == 108) {
       //社群团购
       wx.navigateTo({
         url: '/page/community/pages/main/index'
       })
     } else if (id == 0 && that.data.type == 201) {
       //黑金专区 
       wx.navigateTo({
         url: '/page/Yuemall/pages/NewHotStyle/NewHotStyle?id=478'
       })
     } else {
       wx.showToast({
         title: '请到APP查看~',
         icon: 'none'
       })
     }


   },




   HotelReservation: function () {
     wx.navigateToMiniProgram({
       appId: 'wx84facba553e869a1',
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
   saveMoney: function () {
     wx.switchTab({
       url: '/page/Mall/YueMall',
     })
   },
   join: function (e) { //加入悦旅会
     wx.switchTab({
       url: '/page/EliteCard/EliteCard',
     })
   },
   onLoad: function (options) {
     var that = this
     wx.setNavigationBarTitle({
       title: options.title
     })
     that.setData({
       title: options.title,
       iscard: options.iscard,
       image: options.image,
       type: options.type,
       sharetitle: options.sharetitle,
       shareimg: options.shareimg,
       color: options.color,
       button: options.button
     })
     console.log(options)
   },
   onShow: function () {
     let that = this
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
   },
   onShareAppMessage: function () {
     var pages = getCurrentPages() //获取加载的页面
     var currentPage = pages[pages.length - 1] //获取当前页面的对象
     var url = currentPage.route
     var options = currentPage.options
     var value = ''
     let _this = this;
     let nickname = wx.getStorageSync('nickname');
     try {
       value = wx.getStorageSync('selfReCode')
     } catch (e) {
       // Do something when catch error
     }
     return {
       title: _this.data.sharetitle,
       imageUrl: _this.data.shareimg,
       path: "/page/yueMember/pages/EliteCardDetails/EliteCardDetails?reCode=" + value + '&type=' + _this.data.type + '&image=' + _this.data.image + '&shareimg=' + _this.data.shareimg + '&sharetitle=' + _this.data.sharetitle + '&button=' + _this.data.button,
       complete: (res) => {
         this.setData({
           showModalStatus: 1,
         })
       }
     }
   }
 })