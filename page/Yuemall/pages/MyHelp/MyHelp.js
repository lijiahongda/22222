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
    list: [],
    page: 1,
    pageSize: 10,
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
        goodTypeName: '结束',
        goodTypeId: 2
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
          icon: 'none'
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
  goDetail:function(e){
    wx.navigateTo({
      url: '/page/oneself/pages/orderDetail/orderDetail?ordersn=' + e.currentTarget.dataset.ordersn,
    })
  },
  // 支付
  gopay:function(e){
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/BargainSettlement/BargainSettlement?bargain_id=' + e.currentTarget.dataset.bargain + '&found_id=' + e.currentTarget.dataset.foundid,
    })
  },
  // 拼购详情
  GroupBuyIngo: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/Yuemall/pages/HelpDetails/HelpDetails?found_id='+id,
    })
  },
  // 点击切换tab
  swichNav: function(e) {
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
  getList: function(type) {
    var that = this;
    post('/hd/myBargainLists', {
      uid: wx.getStorageSync('uid'),
      type: that.data.currentTab,
      page: that.data.page,
      pageSize: that.data.pageSize,
      fromType:2
    }, (res) => {
      console.log(res.data.code)
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data,
          page:that.data.page+1
        })
      }else if (res.data.code == 400){
        that.setData({
          list: []
        })
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if (this.data.isHaveMore) {
      post('/hd/myBargainLists', {
        uid: wx.getStorageSync('uid'),
        type: that.data.currentTab,
        page: that.data.page,
        pageSize: that.data.pageSize
    }, (res) => {
        if (res.data.code == 200) {
          console.log(res)
          let list = that.data.list;
          console.log()
          that.setData({
            list: that.data.list.concat(res.data.data),
            page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.length > 0 ? true : false
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
})