// page/My/pages/GroupBuy/GroupBuy.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab 默认选中
    currentTab: 0,
    list:[],
    page:1,
    isHaveMore:true,
    // tab列表
    goodsType: [{
        goodTypeName: '全部',
        goodTypeId: 0
      },
      {
        goodTypeName: '进行中',
        goodTypeId: 1
      },
      {
        goodTypeName: '成功',
        goodTypeId: 2
      },
      {
        goodTypeName: '失败',
        goodTypeId: 3
      }
    ],
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
        that.getList(that.data.currentTab)
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  canceldelete: function () {
    this.setData({
      isdel: false
    })
  },
  delete: function (e) {
    this.setData({
      isdel: true,
      orderNo: e.currentTarget.dataset.ordersn
    })
  },
  evaluate: function (e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/evaluate/evaluate?recordid=' + e.currentTarget.dataset.orderno + '&productid=' + e.currentTarget.dataset.goodid + '&skuid=' + e.currentTarget.dataset.skuid + '&img=' + e.currentTarget.dataset.img,
    })
  },
  // 拼购详情
  GroupBuyIngo:function(e){
    let type = e.currentTarget.dataset.type
    let ordersn = e.currentTarget.dataset.ordersn
    if (e.currentTarget.dataset.state == 1) {// 拼购进行中详情--1
      wx.navigateTo({
        url: '/page/Yuemall/pages/InitiateGroup/InitiateGroup?Entrance=' + 'h' + '&type=' + type + '&ordersn=' + ordersn
      })
      console.log('/page/Yuemall/pages/InitiateGroup/InitiateGroup?Entrance=' + 'h' + '&type=' + type + '&ordersn=' + ordersn)
    } else if (e.currentTarget.dataset.state == 2) {// 拼购成功详情--2
      wx.navigateTo({
        url: '/page/Yuemall/pages/InitiateGroup/InitiateGroup?Entrance=' + 's' + '&type=' + type + '&ordersn=' + ordersn
      })
    } else if (e.currentTarget.dataset.state == 3) {//拼购失败详情--3
      wx.navigateTo({
        url: '/page/Yuemall/pages/InitiateGroup/InitiateGroup?Entrance=' + 'f' + '&type=' + type + '&ordersn=' + ordersn
      })
    }
  },
  // 拼成功的订单详情
  orderDetail:function(e){
    wx.navigateTo({
      url: '/page/oneself/pages/orderDetail/orderDetail?ordersn=' + e.currentTarget.dataset.ordersn,
    })
  },
  // 点击切换tab
  swichNav: function (e) {
    let that = this
    let cur = e.target.dataset.current;
    let url = ''
    if (that.data.currentTab == cur) {
      return false;
    } else {
      that.setData({
        currentTab: cur,
        page: 1,
        isHaveMore: true
      })
      that.getList(cur)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList(0)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 列表
  getList:function(type){
    var that = this;
    post('/hd/MyAssemble', {
      uid: wx.getStorageSync('uid'),
      type: type,
      page:that.data.page,
      fromType:2
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          list: res.data.list,
          page:that.data.page+1
        })
      }
    }, 1, that.data.token, true, that.data.uid,4)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  onReachBottom: function () {
    let that = this
    if (this.data.isHaveMore) {
      post('/hd/MyAssemble', {
        uid: wx.getStorageSync('uid'),
        type: that.data.currentTab,
        page: that.data.page
      }, (res) => {
        if (res.data.code == 200) {
          console.log(res)
          let list = that.data.list;
          console.log()
          that.setData({
            list: that.data.list.concat(res.data.list),
            page: res.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.list.length > 0 ? true : false
          })
        }
      }, 1, that.data.token, true, that.data.uid, 4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  }

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function() {
  //   let that = this;
  //   wx.showLoading();
  //   that.data.pages += 1
  //   post('/hd/MyAssemble ', {
  //     uid: wx.getStorageSync('uid'),
  //     page:that.data.pages,
  //     type: that.data.currentTab
  //   }, (res) => {
  //     if (res.data.code == 200) {
  //       if (res.data.list.length > 0){
  //         that.setData({
  //           list: that.data.list.concat(res.data.list) 
  //         })
  //         wx.hideLoading()
  //       }else{
  //         wx.showToast({
  //           title: '没有更多了！',
  //           icon: 'none'
  //         })
  //       }
  //     }
  //   }, 1, that.data.token, true, that.data.uid, 4)
  // }
})