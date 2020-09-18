import {
  get,
  post,
  wxLogin
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    isCollection: false
  },
  getOrderList: function () {

  },
  // 限时半价
  HalfPrice:function(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/HalfPriceOrder/HalfPriceOrder?orderType='+4,
    })
  },
  SpikeOrder:function(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/HalfPriceOrder/HalfPriceOrder?orderType=' + 3,
    })
  },
  IntegralMallOrder:function(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMallOrder/IntegralMallOrder',
    })
  },
  //  我的助力
  MyHelp: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/MyHelp/MyHelp',
    })
  },
  // 我的团购
  GroupBuy: function () {
    wx.navigateTo({
      url: '/page/yueMember/pages/GroupBuy/GroupBuy',
    })
  },
  // 酒店收藏-商城收藏
  Collection: function (e) {
    let type

    if (e.currentTarget.dataset.type == 1) {
      type = '酒店'
    } else if (e.currentTarget.dataset.type == 2) {
      type = '商城'
    } else if (e.currentTarget.dataset.type == 3) {
      type = '线路'
    }
    wx.navigateTo({
      url: '/page/hotel/pages/MyCollection/MyCollection?collectionType=' + type,
    })
  },
  mallOrder: function (e) {
    wx.navigateTo({
      url: '../../../Yuemall/pages/orderList/orderList'
    })
  },
  // 新版商城
  NewmallOrder: function (e) {
    wx.navigateTo({
      url: '../../../Yuemall/pages/NeworderList/NeworderList?cur='+0
    })
  },
  CustomTourOrder: function (e) {
    wx.navigateTo({
      url: '../../../yueMember/pages/CustomTourOrder/CustomTourOrder'
    })
  },
  goOrderListCard: function (e) {
    wx.navigateTo({
      url: '../../../yueMember/pages/memberOrder/memberOrder'
    })
  },
  goOrderListHotel: function (e) {
    // var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../hotel/pages/hotelOrder/hotelOrder'
      // ?id=' + id
    })
  },
  goRechargeOrder: function (e) {
    // var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../oneself/pages/RechargeOrder/RechargeOrder'
      // ?id=' + id
    })
  },
  // 视频列表
  videoList:function(){
    wx.navigateTo({
      url: '../../../oneself/pages/videoList/videoList'
    })
  },
  onLoad: function (options) {
    let that = this;
    if (options.isCollection == 1) {
      that.setData({
        isCollection: true
      })
      wx.setNavigationBarTitle({
        title: '我的收藏'
      })
    } else {
      that.setData({
        isCollection: false
      })
      wx.setNavigationBarTitle({
        title: '我的订单'
      })
    }

    this.getOrderList();
  },
  onPullDownRefresh: function () {
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  onShow: function () {
    this.getOrderList();
    wx.setStorageSync('myrequest', '');

  }
})