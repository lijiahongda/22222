// page/Yuemall/pages/HotStyle/HotStyle.js
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
    backGround: '', //背景图
    openMember: '',
    isHaveMore: true, //是否加载更多
    page: 1,
    pageSize: 10,
    typeId: '', //爆款id
    isMember: 0,
    order: [],
    authorizationStatus: false,
    couponListId:''//活动id
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let scene = '';
    let reCode = '';
    let id = '';
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        reCode = sceneObj.C;
        id = sceneObj.I;
      });
    } else {
      reCode = options.reCode;
      id = options.id;
    }
    that.setData({
      isMember: wx.getStorageSync('cardType'),
      id: id,
      balance: options.balance
    })
    console.log(options)
    // that.retypeData()
    that.selectComponent("#NewHotStyle")._onOption(id)
    // wx.setNavigationBarTitle({
    //   title: options.name
    // })
  },
  onUnload: function () {
    if (this.data.balance == 'balance') {
      wx.navigateBack({
        delta: 2
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    relations(options.reCode);
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
  //开通会员
  openingMember() {
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },
  // 商品列表  

  //券列表
  getCouponList: function () {
    let that = this
    let uid = 0
    if (wx.getStorageSync('uid')) {
      uid = wx.getStorageSync('uid')
    } else {
      uid = 0
    }
    post('/mall/V2/getCouponList', {
      couponActivityId: that.data.couponListId,
      // couponActivityId: 1,
      uid: uid
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res.data)
        that.setData({
          couponList: res.data.list,
        })
        console.log(res)
        if (res.data.data.list.length > 0){
          that.selectComponent("#coupon")._onOption(res.data.data.list, that.data.couponListId)
        }
      } else {
        // wx.showToast({
        //   title: res.data.msg,
        //   icon: 'none'
        // })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function() {
  //   let that = this
  //   if (this.data.isHaveMore) {
  //     post('/mall/goodsList', {
  //       id: that.data.id,
  //       page: that.data.page,
  //       pageSize: that.data.pageSize,
  //       uid: wx.getStorageSync('uid')
  //     }, (res) => {
  //       if (res.data.code == 200) {
  //         that.setData({
  //           order: that.data.order.concat(res.data.data),
  //           page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
  //           isHaveMore: res.data.data.length > 0 ? true : false
  //         })
  //       } else {
  //         // wx.showToast({
  //         //   title: res.data.msg,
  //         //   icon: 'none'
  //         // })
  //       }
  //     }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  //   } else {
  //     wx.showToast({
  //       title: '没有更多了！',
  //       icon: 'none'
  //     })
  //   }
  // },
  /**
   * 用户点击右上角分享
   */
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
      title: _this.data.top100.remind,
      imageUrl: _this.data.top100.showImg,
      path: "/page/Yuemall/pages/NewHotStyle/NewHotStyle?reCode=" + value + '&id=' + _this.data.id,
      complete: (res) => {

      }
    }
  }
})
