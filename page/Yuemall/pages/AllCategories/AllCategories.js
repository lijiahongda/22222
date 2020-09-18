// page/oneself/pages/BrigadeFestival/BrigadeFestival.js
import {
  get,
  post,
  wxLogin,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backGround: {},
    authorizationStatus: false
  },
  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  // 全品列表
  AllCategories: function (e) {
    if (this.data.type == 'siku') {
      wx.navigateTo({
        url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + e.currentTarget.dataset.typeid + '&name=' + e.currentTarget.dataset.name + '&url=' + '/mall/list' + '&channelId=' + 1,
      })
    } else if (this.data.type == 'wangyi') {
      wx.navigateTo({
        url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + e.currentTarget.dataset.typeid + '&name=' + e.currentTarget.dataset.name + '&url=' + '/mall/list' + '&channelId=' + 2,
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let url
    that.setData({
      type: options.type
    })
    // 'https://mall.yuelvhui.com/app/mall/yan/category/first'
    if (options.type == 'siku') {
      url = '/mall/skuTypeList'
      wx.setNavigationBarTitle({
        title: '寺库全品'
      })
      post('/mall/indexShare', {
        uid: wx.getStorageSync('uid')
      }, (res) => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            top100: res.data.data.shareData.siku
          })
          wx.hideLoading()
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    } else if (options.type == 'wangyi') {
      url = '/mall/yanTypeList'
      wx.setNavigationBarTitle({
        title: '网易全品'
      })
      post('/mall/indexShare', {
        uid: wx.getStorageSync('uid')
      }, (res) => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            top100: res.data.data.shareData.wy
          })
          wx.hideLoading()
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    }
    post(url, {
      uid: wx.getStorageSync('uid')
    }, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        that.setData({
          skuTypeInfo: res.data.data.typeInfo,
          backGround: res.data.backGround
        })
      } else { }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    let that = this;
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
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  onShareAppMessage: function () {
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
      path: "/page/Yuemall/pages/AllCategories/AllCategories?reCode=" + value + '&type=' + _this.data.type,
      complete: (res) => {
        this.setData({
          showModalStatus: 1,
        })
      }
    }
  }
})