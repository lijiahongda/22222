import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1, // 1-今日爆款；2-明日预告
    goodsList:[], // 爆款商品列表
    tabList:[], // tab种类
    tabGoods:[], // tab下的商品
    activityId:'', // 活动id
    tabIndex:0, // 当前tab位于第几个
    data:{},
    tabTop:false,
    hotGoodsHeight:0, // 爆款高度
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageInfoSync('uid'),
      token: wx.getStorageInfoSync('token')
    })
    this.getData()
  },

  // 前往秒杀详情
  flashGoodsDetail(e) {
    let goodsid = e.currentTarget.dataset.goodsid
    let activityid = e.currentTarget.dataset.activityid
    wx.navigateTo({
      url: '/page/Yuemall/pages/RushBuyDetail/RushBuyDetail?goodsId=' + goodsid + '&activityId=' + activityid,
    })
  },

  // 前往普通商品详情
  goodsDetail(e) {
    if (e.currentTarget.dataset.channelid == 8) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/DangBookDetail/DangBookDetail?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodid + '&skuid=' + e.currentTarget.dataset.skuid + '&isFree=' + '37'
      })
    }

  },

  // 切换今明两天
  changeHot(e){
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      type:e.currentTarget.dataset.type
    })
    this.getData()
  },

  // 切换tab
  switchTab(e){
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    this.getTabGoods()
  },

  // 获取爆款商品data
  getData() {
    let that = this,
      data = {
        formType: 1,
        type: this.data.type,
      }
    that.setData({
      goodsList: []
    })
    post('/mall/V2/hotGoodsList', data, (res) => {
      wx.hideLoading()
      if (res.data.code == 200) {
        that.setData({
          goodsList: res.data.data.data,
          activityId: res.data.data.acId,
          data:res.data.data
        })
        that.getTabList()

        //创建节点选择器
        const query = wx.createSelectorQuery()
        query.select('.hotGoods').boundingClientRect()
        query.exec(function (res) {
          that.setData({
            hotGoodsHeight: res[0].height + 10,
          })
        })
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, this.data.token, true, this.data.uid, 4)
  },

  // 获取tab的分类
  getTabList() {
    let that = this,
      data = {
        id: this.data.activityId
      }
    that.setData({
      tabList: []
    })
    post('/mall/V3/getActivityCategoryInfo', data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          tabList: res.data.data.categoryInfo,
        })
        that.getTabGoods()
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, this.data.token, true, this.data.uid, 4)
  },

  // 获取tab分类的商品
  getTabGoods() {
    let that = this,
      data = {
        id: this.data.activityId,
        categoryId: this.data.tabList[this.data.tabIndex].id
      }
    post('/mall/V3/newActivityList', data, (res) => {
      wx.hideLoading()
      that.setData({
        tabGoods: []
      })
      if (res.data.code == 200) {
        that.setData({
          tabGoods: res.data.data[0].goodsInfo,
        })
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, this.data.token, true, this.data.uid, 4)
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onPageScroll(e){
    if (e.scrollTop >= this.data.hotGoodsHeight){
      this.setData({
        tabTop:true
      })
    }else{
      this.setData({
        tabTop: false
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ((this.data.tabIndex + 1) == this.data.tabList.length){
      this.setData({
        tabIndex: 0
      })
    }else{
      this.setData({
        tabIndex: (this.data.tabIndex + 1)
      })
    }
    wx.showLoading({
      title: '加载中',
    })

    wx.pageScrollTo({
      scrollTop: this.data.hotGoodsHeight,
      duration: 300
    })
    this.getTabGoods()
  },
})