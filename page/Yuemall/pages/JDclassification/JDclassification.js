// page/Yuemall/pages/JDclassification/JDclassification.js
import {
  get,
  post,
  relations
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classA: [],
    classAID: '',
    LoadingStatus: false,
    secondLevelItem: [],
    authorizationStatus: false
  },

  // 分类列表
  classificationList: function (e) {
    app.classificationList(e, this)
  },
  // 默认数据
  defaultData: function() {
    let that = this;
    that.setData({
      LoadingStatus: true
    })
    post('/mall/jdTypeList', {
      fromType: 1,
      channelId: that.data.channelId
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          classAID: res.data.data.typeFirst[0].goodTypeId,
          classA: res.data.data.typeFirst,
          secondLevelItem: res.data.data.typeTwo,
          banner: res.data.banner,
          brand: res.data.brand
        })
        if (res.data.mechanismId != '') {
          that.selectComponent("#couponPopup")._onOption(res.data.mechanismId)
        } else {
          
        }
        that.setData({
          LoadingStatus: false
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    post('/mall/indexShare', {
      uid: wx.getStorageSync('uid')
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        if (that.data.channelId == 3) {//京东
          that.setData({
            top100: res.data.data.shareData.jd
          })
        } else if (that.data.channelId == 1){//寺库
          
          that.setData({
            top100: res.data.data.shareData.siku
          })
        }else{//网易
          console.log(res)
          that.setData({
            top100: res.data.data.shareData.kaola
          })
        }
        wx.hideLoading()
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // JD 列表
  JDList: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/LevelList/LevelList?keyWord=' + e.currentTarget.dataset.name + '&categoryThreeId=' + e.currentTarget.dataset.id + '&type=' + 'class' + '&categorySecondId=' + e.currentTarget.dataset.categorysecondid + '&categoryFirstId=' + this.data.classAID + '&channelid=' + this.data.channelId
    })
    // wx.navigateTo({
    //   url: '/page/Yuemall/pages/JDList/JDList?id=' + e.currentTarget.dataset.id + '&aid=' + e.currentTarget.dataset.aid + '&title=' + e.currentTarget.dataset.name + '&channelId=' + this.data.channelId,
    // })
    // console.log(this.data.channelId)
  },
  // 搜索商品
  search: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/search/search?channelid=' + 3,
    })
  },
  // 一级标题切换
  classA: function(e) {
    let that = this;
    that.setData({
      classAID: e.currentTarget.dataset.id
    })
    wx.showLoading({
      title: '加载中',
    });
    post('/mall/jdTypeLevel', {
      goodsTypeId: e.currentTarget.dataset.id,
      channelId: that.data.channelId
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          secondLevelItem: res.data.data,
          brand: res.data.brand
        })
        wx.hideLoading()
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          secondLevelheight: res.screenHeight
        })
      },
    })
    that.setData({
      channelId: options.channelId
    })
    that.defaultData()

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
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    relations(options.reCode);
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
      if (wx.getStorageSync('mapId')) {
        //说明已经授权，去绑定
        console.log('说明已经授权，去绑定======')
        that.setData({
          authorizationStatus: true
        })
      } else {
        //还未授权，去授权
        console.log('还未授权，去授权')
        that.setData({
          authorizationStatus: true
        })
      }
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route
    var options = currentPage.options
    var value = ''
    let _this = this;
    let nickname = wx.getStorageSync('nickname');
    try {
      value = wx.getStorageSync('selfReCode')
    } catch (e) {
      // Do something when catch error
    }
    return {
      title: _this.data.top100.title,
      imageUrl: _this.data.top100.showImg,
      path: "/page/Yuemall/pages/JDclassification/JDclassification?reCode=" + value + '&channelId=' + _this.data.channelId,
      complete: (res) => {
        this.setData({
          showModalStatus: 1,
        })
      }
    }
  }
})