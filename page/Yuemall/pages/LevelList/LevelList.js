// page/Yuemall//pages/LevelList/LevelList.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    isHaveMore:true,
    searchType: true,//列表样式 默认横排
    sortVal: 1,//排序切换
    sortUp: '',//价格排序
    sort: 1,//默认排序
    sortDown: '',
    currentTab: 0,
    categorylist: [],
    range: 'down',
    screenBox: false,
    screenOrder: {},
    minprice: '',
    maxprice: '',
    order: [],
    categorySecondId:''
  },



  details: function (e) {
    wx.navigateTo({
      url: '../details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
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
      if (that.data.minprice && that.data.maxprice) {  //有输入价格区间
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
    let obj = {}
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
    obj = {
      keyword: that.data.keyWord,
      sorttype: that.data.sortVal,
      sort: that.data.sort,
      channelId: that.data.channelid,
      page: 1,
      categoryFirstId: '',
      categorySecondId: that.data.categorySecondId,
      categoryThreeId: that.data.categoryThreeId,
      brandId: that.data.brandId,
      minprice: that.data.minprice,
      maxprice: that.data.maxprice,
    }
    if (that.data.type == 'brand'){
      obj.indexKey='brandId'
    }else{
      console.log('====', that.data.categoryFirstId)
      obj.indexKey =  'categoryThreeId'
    }
    
    wx.showLoading()
    post('/mall/search/v2/keyword',obj, (res) => {
      if (res.data.code == 200) {
        that.setData({
          order: res.data.data.doc,
          categorylist: res.data.data.menu
        })
        wx.hideLoading()
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options,'optttttt')
    that.setData({
      type:options.type,
      keyWord: options.keyWord,
      categoryFirstId:options.categoryFirstId,
      categorySecondId: options.categorySecondId,
      categoryThreeId: options.categoryThreeId,
      channelid: options.channelid,
      brandId: options.brandId
    })
    wx.setNavigationBarTitle({
      title: options.keyWord,
    })
    that.getOrderList()
    that.getScreen()
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    let obj = {}
    wx.showLoading()
    that.setData({
      page: that.data.page + 1
    })
    obj = {
      keyword: that.data.keyWord,
      sorttype: that.data.sortVal,
      sort: that.data.sort,
      channelId: that.data.channelid,
      page: that.data.page,
      categoryFirstId: '',
      categorySecondId: that.data.categorySecondId,
      categoryThreeId: that.data.categoryThreeId,
      brandId: that.data.brandId,
      minprice: that.data.minprice,
      maxprice: that.data.maxprice,
    }
    if (that.data.type == 'brand') {
      obj.indexKey = 'brandId'
    } else {
      console.log('====', that.data.categoryFirstId)
      obj.indexKey = 'categoryThreeId'
    }
    
    post('/mall/search/v2/keyword', obj, (res) => {
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