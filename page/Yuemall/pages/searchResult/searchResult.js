import {
  get,
  post
} from '../../../../utils/util.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    uid: '',
    token: '',
    order: [],
    pageSize: 10,
    page: 1,
    isHaveMore: true,
    goodtypeid: '',
    keyWord: '',
    type: 0,
    contentTile: 'categoryFirstId',
    contentid: '',
    brandId: '',
    channelid: 'all',

    searchType: true, //列表样式 默认横排
    sortVal: 1, //排序切换
    sortUp: '', //价格排序
    sort: 1, //默认排序
    sortDown: '',
    currentTab: '',
    categorylist: [],
    range: 'down',
    screenBox: false,
    screenOrder: {},
    minprice: '',
    maxprice: '',
    scrollTop: 0,
    animation: true
  },

  details: function (e) {
    console.log(e)
    app.globalData.positionFrom = 2
    if (this.data.channelid == '98') {
      wx.navigateTo({
        url: '/page/Yuemall/pages/pddDetails/details?goodsId=' + e.currentTarget.dataset.productid,
      })
    } else if (this.data.channelid == '100') { // 京东优选
      wx.navigateTo({
        url: '/page/Yuemall/pages/JDUnionDetail/JDUnionDetail?goods_id=' + e.currentTarget.dataset.goodsid,
      })
    } else if (this.data.channelid == '101') { // 唯品会
      wx.navigateTo({
        // page/Yuemall/pages / wphDetail / wphDetail
        url: '/page/Yuemall/pages/wphDetail/wphDetail?goods_id=' + e.currentTarget.dataset.goodsid,
      })
    } {
      wx.navigateTo({
        url: '../details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
      })
    }
  },
  // 切换排序样式
  sortSwitch: function (e) {
    let type = e.currentTarget.dataset.type
    let that = this
    that.setData({
      searchType: !that.data.searchType
    })
  },
  // 分类切换
  switchNav: function (e) {
    let that = this
    let idx = e.currentTarget.dataset.idx
    let item = e.currentTarget.dataset.item
    console.log(item, 'switchNav')

    that.setData({
      currentTab: idx,
      channelid: item.channelid
    })
    that.getOrderList()
  },
  // 排序
  sort: function (e) {
    let val = e.currentTarget.dataset.val
    let that = this
    if (val == 3) {
      if (that.data.sortUp == 'up') {
        that.data.sortUp = ''
        that.data.sortDown = 'down'
        that.data.sort = 0
      } else {
        that.data.sortUp = 'up'
        that.data.sortDown = ''
        that.data.sort = 1
      }
    } else {
      that.data.sortUp = ''
      that.data.sortDown = ''
      that.data.sort = 0
    }
    this.setData({
      sortVal: val,
      sortUp: that.data.sortUp,
      sortDown: that.data.sortDown,
      sort: that.data.sort
    })
    this.getOrderList()
  },
  // 筛选中 价格input
  bindinputMin: function (e) {
    this.setData({
      minprice: e.detail.value
    })
  },
  bindinputMax: function (e) {
    this.setData({
      maxprice: e.detail.value
    })
  },
  // 点击搜索框 返回上一页
  goBack: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  // 品牌 分类 展开隐藏
  priceRange: function (e) {
    console.log(e.currentTarget.dataset.type, '==')
    let type = e.currentTarget.dataset.type
    let clas = e.currentTarget.dataset.clas
    if (clas == 'brand') {
      this.setData({
        range: type
      })
    } else {
      this.setData({
        rangeCate: type
      })
    }
  },
  // 筛选弹窗
  screenBox: function () {
    let that = this
    if (that.data.screenBox) {
      // 确定
      if (that.data.minprice && that.data.maxprice) { //有输入价格区间
        let min = Number(that.data.screenOrder.priceList.item[0].min)
        if ((Number(that.data.minprice) >= min) && (Number(that.data.maxprice) > Number(that.data.minprice))) {
          that.getOrderList()
        } else {
          wx.showToast({
            title: '请输入正确价格区间',
            icon: 'none'
          })
          return
        }
      } else {
        that.getOrderList()
      }
    }
    that.setData({
      screenBox: !that.data.screenBox
    })
  },
  // 获取筛选列表
  getScreen: function () {
    let that = this
    post('/mall/search/v2/screen', {
      keyword: that.data.keyWord,
      sorttype: that.data.sortVal,
      sort: that.data.sort,
      channelId: that.data.channelid,
      categoryFirstId: '',
      categorySecondId: '',
      categoryThreeId: ''
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res, '=====')
        that.setData({
          screenOrder: res.data.data
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 筛选弹框中选择  价格
  choseSceen: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let type = e.currentTarget.dataset.type
    if (type == "price") {
      that.setData({
        minprice: item.min,
        maxprice: item.max,
      })
    } else if (type == "brand") {
      that.setData({
        brandId: item.brandId
      })
    } else if (type == 'category') {
      that.setData({
        categoryThreeId: item.categoryThreeId,
      })
    } else if (type == 'channel') {
      that.setData({
        channelId: item.channelId
      })
    }
  },
  // 重置
  reset: function () {
    this.setData({
      minprice: '',
      maxprice: '',
      brandId: '',
      categoryThreeId: '',
      channelId: ''
    })
  },



  getOrderList: function () {
    let that = this

    if (that.data.channelid == undefined || that.data.channelid === '') {
      that.setData({
        channelid: 'all'
      })
    }

    // keyword: 关键词， 
    // sorttype: 类型 1 综合，2 销量，3 价格，  
    // sort: 排序 0升序 1降序 对应价格， 
    // channelid: all 所有，0自营，1寺库，3京东，6，考拉
    // 筛选中用
    // brandId:品牌,
    // minprice: 最低价,
    // maxprice: 最高价
    wx.showLoading()
    post('/mall/search/v2/keyword2', {
      keyword: that.data.keyWord,
      sorttype: that.data.sortVal,
      sort: that.data.sort,
      channelId: that.data.channelid,
      page: 1,
      categoryFirstId: '',
      categorySecondId: '',
      categoryThreeId: that.data.categoryThreeId,
      brandId: that.data.brandId,
      minprice: that.data.minprice,
      maxprice: that.data.maxprice
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          order: res.data.data.doc,
          categorylist: res.data.data.newmenuend,
          textid: that.data.textid
        })
        console.log(that.data.textid)
        console.log(res.data.data.newmenu)
        wx.hideLoading()
        if (that.data.channelid == 100) { // 京东优选
          res.data.data.newmenuend.forEach((item, index) => {
            if (item.channelid == 100) {
              that.setData({
                currentTab: index,
                channelid: 100,
                scrollTop: 750
              })
            }
          })
        } else if (that.data.channelid == 98) { // 京东优选
          res.data.data.newmenu.forEach((item, index) => {
            if (item.channelid == 98) {
              that.setData({
                currentTab: index,
                channelid: 98,
                scrollTop: 500
              })
            }
          })
        }
        if (that.data.channelid == 101) { // 唯品会
          res.data.data.newmenuend.forEach((item, index) => {
            if (item.channelid == 101) {
              that.setData({
                currentTab: index,
                channelid: 101,
                scrollTop: 750
              })
            }
          })
        }
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  getleft(e) {
    console.log(e)
    if (e.detail.x > 200) {
      this.setData({
        slideLeft: 186,
      })
    } else {
      this.setData({
        slideLeft: 0,
      })
    }
  },
  onLoad: function (options) {
    console.log('第二页', options)
    let that = this
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      keyWord: options.keyWord,
      type: options.type,
      contentTile: options.contentTile,
      contentid: options.contentid,
      brandId: options.brandId,
      channelid: options.channelid,
      textid: "to" + options.channelid
    })
    console.log(that.data.textid, options.channelid)
    if (options.channelid == '98') {
      that.setData({
        slideLeft: 186
      })
    }
    console.log(this.data.slideLeft, 'options.channelid')
    console.log(this.data.keyWord, 'keyWord')
    this.getOrderList();
    this.getScreen()
  },

  onShow: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    wx.showLoading()
    that.setData({
      page: that.data.page + 1
    })
    post('/mall/search/v2/keyword2', {
      keyword: that.data.keyWord,
      sorttype: that.data.sortVal,
      sort: that.data.sort,
      channelId: that.data.channelid,
      categoryFirstId: '',
      categorySecondId: '',
      categoryThreeId: that.data.categoryThreeId,
      brandId: that.data.brandId,
      minprice: that.data.minprice,
      maxprice: that.data.maxprice,
      page: that.data.page
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        if (res.data.data.doc.length) {
          that.setData({
            order: that.data.order.concat(res.data.data.doc),
          })
        } else {
          wx.showToast({
            title: '没有更多了！',
            icon: 'none'
          })
        }
        wx.hideLoading()
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },

})