// page/Cloud/index.js
import {
  post,
  get,
  retrunScene,
  relations
} from '../../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adver:{},//广告
    list: [],
    swiperIndex:'',
    choseCIndex:0,
    page:1
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    //扫码参数分解
    if (options.scene != null) {
      console.log(options)
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
        console.log(sceneObj.C)
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getList()
    that.getShare()
  },
  getList(){
    let that = this
    post('/mall/getXyHomeData', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          banner: res.data.data.banner,//banner
          area: res.data.data.area,//全球馆
          trade: res.data.data.trade,//直销
          cate: res.data.data.cate,//分类
          activity: res.data.data.activity[0],//四个板块
          brand: res.data.data.brand,//推荐品牌
          choseId: res.data.data.cate[0].category_id
        })
        that.getListShop(res.data.data.cate[0].category_id)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 获取底部商品列表
  getListShop:function(id){
    let that = this
    post('/mall/getXyHomeGoods', {
      categoryFirstId: id,
      pageSize:10,
      page:1
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data.data,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
 

  // 跳转到包含类别的列表
  goClassList: function (e) {
    wx.navigateTo({
      url: '../searchResult/searchResult?keyWord=' + e.currentTarget.dataset.keyword + '&channelId=7&classList=all&categoryFirstId=' + e.currentTarget.dataset.categoryfirstid + '&indexKey=categoryFirstId',
    })
  },

  // 跳转到搜索结果
  goClassInfoList: function (e) {
    let item = e.currentTarget.dataset
    wx.navigateTo({
      url: '../searchResult/searchResult?keyWord=' + item.keyword + '&channelId=' + item.channelid + '&id=' + item.id + '&indexKey=' + item.indexkey + '&xyType=' + item.xytype + '&type=' + item.type + '&brandId=' + item.brandid,
    })
  },
  
 

  // banner跳转  商品详情跳转
  classificationList:function(e){
    app.classificationList(e, this)
  },
  // 全球馆
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  // 分类列表
  choseClass:function(e){
    this.setData({
      choseCIndex: e.currentTarget.dataset.index,
      choseId: e.currentTarget.dataset.id,
      page:1
    })
    this.getListShop(e.currentTarget.dataset.id)
  },
  // 品牌更多
  brandMore:function(){
    wx.navigateTo({
      url: '/page/Cloud/pages/brand/brand'
    })
  },
  // 搜索
  search:function(){
    wx.navigateTo({
      url: '/page/Cloud/pages/search/search'
    })
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
    post('/mall/getXyHomeGoods', {
      categoryFirstId: that.data.choseId,
      pageSize: 10,
      page: that.data.page
    }, (res) => {
      if (res.data.code == 200) {
        if (res.data.data.data.length) {
          that.setData({
            list: res.data.data.data,
            list: that.data.list.concat(res.data.data.data),
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
  // 分享
  getShare:function(){
    let that = this
    post('/mall/indexShare', {
      uid: wx.getStorageSync('uid') ? wx.getStorageSync('uid'):'0'
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          top100: res.data.data.shareData.allEarth
        })
        wx.hideLoading()
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const reCode = wx.getStorageSync('selfReCode'); //分享携带本人邀请码
    let shareUrl = "page/Cloud/pages/index/index?reCode=" + reCode;
    console.log(shareUrl)
    return {
      title: this.data.top100.title,
      path: shareUrl,
      imageUrl: this.data.top100.showImg,
    }
  }
})