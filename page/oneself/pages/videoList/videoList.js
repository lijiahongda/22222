// page/My/pages/GroupBuy/GroupBuy.js
import {
  get,
  post
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab 默认选中
    isHaveMore: true,
    currentTab: 0,
    list: [{
      a: 1,
      ordersn: '22222'
    }, {
      a: 2
    }, {
      a: 3
    }],
    page: 1,
    pageSize: 10,
    // tab列表
    goodsType: [{
        goodTypeName: '全部',
        goodTypeId: 0
      },
      {
        goodTypeName: '待付款',
        goodTypeId: 1
      },
      {
        goodTypeName: '充值中',
        goodTypeId: 2
      },
      {
        goodTypeName: '已完成',
        goodTypeId: 3
      }
    ],
    showAll: false
  },
  confirm: function() {
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
  // 详情跳转
  goDetail: function(e) {
    let {
      statusname,
      ordersn
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/page/oneself/pages/videoDetail/videoDetail?orderno=' + ordersn + '&statusname=' + statusname
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
    let that = this
    that.getList()
  },
  // 分类列表
  classificationList: function (e) {
    app.classificationList(e, this)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 列表
  getList: function(type) {
    var that = this;
    post('/vcard/orderList', {
      type: that.data.currentTab,
      page: that.data.page
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data.data,
          page: that.data.page + 1
        })
      } else if (res.data.code == 400) {
        that.setData({
          list: []
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    get('/vcard/videoBanner?type=1', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          banner: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    if (this.data.isHaveMore) {
      post('/vcard/orderList', {
        type: that.data.currentTab,
        page: that.data.page
      }, (res) => {
        if (res.data.code == 200) {
          console.log(res)
          let list = that.data.list;
          console.log()
          that.setData({
            list: that.data.list.concat(res.data.data.data),
            page: res.data.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.data.length > 0 ? true : false
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
      that.setData({
        showAll: true
      })
    }
  }
})