import { get, post } from '../../../../utils/util.js';
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
    channelId: 'all',


    searchType:true,//列表样式 默认横排
    sortVal:1,//排序切换
    sortUp:'',//价格排序
    sort:1,//默认排序
    sortDown:'',
    currentTab:0,
    categorylist:[],
    range:'down',
    screenBox:false,
    screenOrder:{},
    minprice:'',
    maxprice:'',
  },

  details: function (e) {
    wx.navigateTo({
      // page/Yuemall/pages/details/details
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  // 切换排序样式
  sortSwitch: function (e) {
    let type = e.currentTarget.dataset.type
    let that = this
    that.setData({
      searchType:!that.data.searchType
    })
  },
  // 分类切换
  switchNav:function(e){
    let that = this
    let idx = e.currentTarget.dataset.idx
    let item = e.currentTarget.dataset.item
    if (that.data.classList == 'all') {
      that.setData({
        currentTab:idx,
        categoryFirstId: item.categoryId,
        keyWord: item.categoryName
      })
    }else{
      that.setData({
        currentTab: idx,
        channelId: item.channelId
      })
    }
    that.getOrderList()
  },
  // 排序
  sort:function(e){
    let val = e.currentTarget.dataset.val
    let that = this
    if(val==3){
      if (that.data.sortUp == 'up'){
        that.data.sortUp = ''
        that.data.sortDown = 'down'
        that.data.sort = 0
      }else{
        that.data.sortUp = 'up'
        that.data.sortDown = ''
        that.data.sort = 1
      }
    }else{
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
  bindinputMin:function(e){
    this.setData({
      minprice: e.detail.value
    })
  },
  bindinputMax: function (e) {
    this.setData({
      maxprice: e.detail.value
    })
  },
  // 点击搜索框 到搜索页面
  goBack:function(){
    if (this.data.isSearch){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.redirectTo({
        url: '/page/Cloud/pages/search/search',
      })
    }
  },

  // 品牌 分类 展开隐藏
  priceRange:function(e){
    let type = e.currentTarget.dataset.type
    let clas = e.currentTarget.dataset.clas
    if (clas =='brand'){
      this.setData({
        range:type
      })
    }else{
      this.setData({
        rangeCate: type
      })
    }
    console.log(this.data.screenOrder.categoryList, '这里 这里')
    console.log(this.data.rangeCate,'--------')

  },
  // 筛选弹窗
  screenBox:function(){
    let that = this
    if (that.data.screenBox){
      // 确定
      if (that.data.minprice && that.data.maxprice){  //有输入价格区间
        if (!that.data.screenOrder.priceList.item.length){
          if (Number(that.data.maxprice) > Number(that.data.minprice)){
            that.getOrderList()
          } else {
            wx.showToast({
              title: '请输入正确价格区间',
              icon: 'none'
            })
            return
          }
        }else{
          
          let min = Number(that.data.screenOrder.priceList.item[0].min)
          if ((Number(that.data.minprice) >= min) && (Number(that.data.maxprice) > Number(that.data.minprice))){
            that.getOrderList()
          }else{
            wx.showToast({
              title: '请输入正确价格区间',
              icon:'none'
            })
            return
          }
        }
      }else{
        that.getOrderList()
      }
    }
    that.setData({
      screenBox: !that.data.screenBox
    })
  },
  
  // 获取筛选列表
  getScreen:function(){
    let that = this
    let obj = {}
      
    obj = {
      sorttype: that.data.sortVal,
      sort: that.data.sort,
      channelId: that.data.channelId,
      keyword: that.data.keyWord,
      page: 1,
      pageSize: 10
    }
    if (that.data.indexKey == 'importType') {//商品类型筛选
      obj.indexKey = that.data.indexKey,
      obj.importType = that.data.id
    }
    else if (that.data.type == 'brand') {//品牌筛选参数
      obj.indexKey = 'brandId',
      obj.brandId = that.data.brandId
    }
    else if (that.data.indexKey =='productArea'){//产地筛选
      obj.indexKey = that.data.indexKey,
      obj.productArea=that.data.id
    }
    else if (that.data.indexKey == 'categoryFirstId') {//分类筛选 -----------------
      obj.indexKey = 'categoryfirstid',
      obj.categoryfirstid = that.data.categoryFirstId
    }
       

    post('/mall/search/v2/screen', obj, (res) => {
      if (res.data.code == 200) {
        that.setData({
          screenOrder:res.data.data
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 筛选弹框中选择  价格
  choseSceen:function(e){
    let that = this
    let item = e.currentTarget.dataset.item
    let type = e.currentTarget.dataset.type
    if(type == "price"){
      that.setData({
        minprice: item.min,
        maxprice: item.max,
      })
    } else if (type == "brand"){
      that.setData({
        brandId: item.brandId
      })
    } else if (type =='category'){
      that.setData({
        categoryThreeId: item.categoryThreeId,
        categoryFirstId: item.categoryFirstId
      })
    } else if (type =='channel'){
      that.setData({
        channelId: item.channelId
      })
    }
  },
  // 重置
  reset:function(){
    this.setData({
      minprice: '',
      maxprice: '',
      brandId: '',
      categoryThreeId: '',
      categoryFirstId:'',
      channelId: ''
    })
  },
  

  
  getOrderList: function () {
    let that = this
    that.setData({
      page:1
    })
    if (that.data.channelId == undefined || that.data.channelId === '') {
      that.setData({
        channelid: 'all'
      })
    }
  
    // keyword: 关键词， 
    // sorttype: 类型 1 综合，2 销量，3 价格，  
    // sort: 排序 0升序 1降序 对应价格， 
    // channelId: all 所有，0自营，1寺库，3京东，6，考拉
    // 筛选中用
    // brandId:品牌,
    // minprice: 最低价,
    // maxprice: 最高价
    wx.showLoading()
    let url =''
    let obj ={}
    // 行云
  
    if (that.data.xyType=='xy'){//banner下方分类 产地
      url = '/mall/getXySearch'
//       brandId: item.brandId
//     })
//     } else if (type == 'category') {
//   that.setData({
//     categoryThreeId: item.categoryThreeId,
//     categoryFirstId: item.categoryFirstId
//   })
// } else if (type == 'channel') {
//   that.setData({
//     channelId: item.channelId
      obj={
        sorttype: that.data.sortVal,
        sort: that.data.sort,
        channelId: that.data.channelId,
        keyword: that.data.keyWord,
        id: that.data.id,
        indexKey: that.data.indexKey,
        page: 1,
        pageSize: 10,
        minprice: that.data.minprice,
        maxprice: that.data.maxprice,
        brandId: that.data.brandId,
        categoryFirstId: that.data.categoryFirstId
      }
      // if (that.data.brandId){
      //   obj.brandId = that.data.brandId
      // }
    } else if (that.data.classList == 'all') {//分类更多
      url ='/mall/getXyCateGoods'
      obj = {
        sorttype: that.data.sortVal,
        sort: that.data.sort,
        channelId: that.data.channelId,
        keyword: that.data.keyWord,
        id: that.data.id,
        indexKey: that.data.indexKey,
        categoryFirstId: that.data.categoryFirstId,
        page: 1,
        pageSize: 10,
        brandId: that.data.brandId,
        minprice: that.data.minprice,
        maxprice: that.data.maxprice,
      }
    }
    else{
      url = '/mall/search/v2/keyword'
      obj={
        keyword: that.data.keyWord,
        sorttype: that.data.sortVal,
        sort: that.data.sort,
        channelId: that.data.channelId,
        page: 1,
        categoryFirstId: that.data.categoryFirstId ? that.data.categoryFirstId:'',
        brandId: that.data.brandId,
        minprice: that.data.minprice,
        maxprice: that.data.maxprice
      }
      if (that.data.type == 'brand') {
        obj.indexKey = 'brandId'
      } else if (that.data.classList=='all') {
        obj.indexKey = 'categoryFirstId'
      }
    }


    post(url, obj, (res) => {
      if (res.data.code == 200) {
        if (that.data.xyType == 'xy'){
          that.setData({
            order: res.data.data.data,
          })
        } else if (that.data.classList == 'all'){
          that.setData({
            order: res.data.data.data,
            categorylist:res.data.data.type
          })
        }else{
          that.setData({
            order: res.data.data.doc,
          })
        }
        wx.hideLoading()
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  onLoad: function (options) {
    console.log('第二页',options)
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      keyWord: options.keyWord,
      type: options.type,
      contentTile: options.contentTile,
      contentid: options.contentid,
      brandId: options.brandId,
      channelId: options.channelId,
      classList: options.classList,
      categoryFirstId: options.categoryFirstId,
      id:options.id,
      indexKey: options.indexKey,
      xyType: options.xyType,//值为xy 标识为行云进入
      isSearch: options.isSearch,//判断是否是搜索页面进入  1是
    })
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
      page: that.data.page+1
    })
    let url = ''
    let obj = {}
    // 行云
    if (that.data.xyType == 'xy') {//banner下方分类 产地
      url = '/mall/getXySearch'
      obj = {
        sorttype: that.data.sortVal,
        sort: that.data.sort,
        channelId: that.data.channelId,
        keyword: that.data.keyWord,
        id: that.data.id,
        indexKey: that.data.indexKey,
        page: that.data.page,
        pageSize: 10,
        minprice: that.data.minprice,
        maxprice: that.data.maxprice,
      }
    } else if (that.data.classList == 'all') {//分类更多
      url = '/mall/getXyCateGoods'
      obj = {
        sorttype: that.data.sortVal,
        sort: that.data.sort,
        channelId: that.data.channelId,
        keyword: that.data.keyWord,
        id: that.data.id,
        indexKey: that.data.indexKey,
        categoryFirstId: that.data.categoryFirstId,
        page: that.data.page,
        pageSize: 10,
        brandId: that.data.brandId,
        minprice: that.data.minprice,
        maxprice: that.data.maxprice,
      }
    }
    else {
      url = '/mall/search/v2/keyword'
      obj = {
        keyword: that.data.keyWord,
        sorttype: that.data.sortVal,
        sort: that.data.sort,
        channelId: that.data.channelId,
        page: that.data.page,
        categoryFirstId: that.data.categoryFirstId ? that.data.categoryFirstId : '',
        brandId: that.data.brandId,
        minprice: that.data.minprice,
        maxprice: that.data.maxprice
      }
      if (that.data.type == 'brand') {
        obj.indexKey = 'brandId'
      } else if (that.data.classList == 'all') {
        obj.indexKey = 'categoryFirstId'
      }
    }


    post(url, obj, (res) => {
      if (res.data.code == 200) {
        if (that.data.xyType == 'xy' || that.data.classList == 'all') {//banner下方分类 产地  //分类更多
          if (res.data.data.data.length){
            that.setData({
              order: that.data.order.concat(res.data.data.data),
            })
          } else {
            wx.showToast({
              title: '没有更多了！',
              icon: 'none'
            })
          }
          wx.hideLoading()
        }else{
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
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },

})