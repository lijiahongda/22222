import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    uid: '',
    token: '',
    order: [],
    isHaveMore: true,
    page: 1,
    isreType: true
  },
  // 详情
  details: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid,
    })
  },
  // 销毁页面
  onUnload: function () {
    if (this.data.success == 'success') {
      wx.navigateBack({
        delta: 2
      })
    }
  },
  // 初始化页面  --  特惠
  getOrderList: function() {
    let that = this
    post('/app/mall/newSpecial/more', {}, (res) => {
      if (res.data.status == 200) {
        that.setData({
          order: res.data.data,
          page: that.data.page + 1,
          carousel: res.data.carousel.url
        })
      } else {

      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true)
  },
  // 商品列表  -- 商城首页 轮播下方icon点击 进列表所走的数据
  retypeData: function() {
    let that = this
    post('/app/mall/goodsList', {
      goodTypeId: that.data.parentTypeId,
      page: that.data.page,
      pageSize: that.data.pageSize,
      uid:wx.getStorageSync('uid')
    }, (res) => {
      if (res.data.status == 200) {
        that.setData({
          order: res.data.data,
          backGround: res.data.backGround.url,
          isShow: res.data.isShow,
          page: that.data.page + 1
        })
      } else {

      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true)
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      parentTypeId: options.parentTypeId,
      success: options.success,
      cardType: wx.getStorageSync('cardType')
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
    if (options.reType == '1') {
      that.setData({
        isreType: false
      })
      that.retypeData()
    } else {
      that.setData({
        isreType: true
      })
      that.getOrderList();
    }

  },
  onPullDownRefresh: function() {
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  onShow: function() {
    let  that = this
    that.setData({
      isHaveMore:true,
      page:1
    })
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    if (that.data.isreType) {
      if (this.data.isHaveMore) {
        post('/app/mall/special/more', {
          page: that.data.page,
          pageSize: that.data.pageSize
        }, (res) => {
          if (res.data.status == 200) {
            let order = that.data.order;
            var list = res.data.data;
            that.setData({
              order: that.data.order.concat(res.data.data),
              page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.length > 0 ? true : false
            })
          } else {

          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    } else {
      if (this.data.isHaveMore) {
        post('/app/mall/goodsList', {
          goodTypeId: that.data.parentTypeId,
          page: that.data.page,
          pageSize: that.data.pageSize
        }, (res) => {
          if (res.data.status == 200) {
            let order = that.data.order;
            var list = res.data.data;
            that.setData({
              order: that.data.order.concat(res.data.data),
              page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.length > 0 ? true : false
            })
          } else {

          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    }

  },
})