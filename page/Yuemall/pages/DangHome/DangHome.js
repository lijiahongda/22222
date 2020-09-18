// page/Yuemall//pages/DangHome/DangHome.js
import {
  get,
  post,
  retrunScene,
  relations
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 5,
    spaceList: [],
    LoadingStatus: false,
  },
  // 初始化
  dataList: function() {
    let that = this
    that.setData({
      LoadingStatus: true
    })
    wx.showLoading()
    post('/mall/dd/index', {
      uid: wx.getStorageSync('uid'),
      page: that.data.page,
      pageSize: that.data.pageSize
    }, (res) => {
      if (res.data.code == 200) {
        let data = res.data.data
        that.setData({
          list: data,
          listBook: res.data.data.categoryData,
          LoadingStatus: false,
          page: that.data.page + 1,
          ad: res.data.data.backImg
        })
        if (res.data.mechanismId != '') {
          console.log(11111111)
          that.selectComponent("#couponPopup")._onOption(res.data.mechanismId)
        } else {

        }
        setTimeout(function() {
          wx.hideLoading()
        }, 1500)
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    post('/mall/indexShare', {
      uid: wx.getStorageSync('uid')
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          top100: res.data.data.shareData.jdSpcial
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 点击搜索
  search:function(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/Dangsearch/Dangsearch',
    })
  },
  // 点击全部
   all:function(e){
     console.log(e.currentTarget.dataset.all)
     console.log(e.currentTarget.dataset.name)
     wx.navigateTo({
       url: '/page/Yuemall/pages/Dangtuijian/Dangtuijian?id=' + e.currentTarget.dataset.all + '&name=' + e.currentTarget.dataset.name
     })
   },
  Details: function(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.goodsskuid,1111)
    console.log(e.currentTarget.dataset.goodsid)
    wx.navigateTo({
      url: '/page/Yuemall/pages/DangBookDetail/DangBookDetail?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.goodsskuid + '&type=' + 'half'
    })
  },
  //点击全部分类
  goclassification: function (e) {
    app.classificationList(e, this)
  },

  //点击banner
  gobanner: function (e) {
    app.classificationList(e, this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.dataList()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})