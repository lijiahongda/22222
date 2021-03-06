// page/Mall/pages/BargainPriceList/BargainPriceList.js
import {
  get,
  post,
  wxLogin,
  relations
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    isHaveMore: true,
    authorizationStatus: false
  },
  // 分类列表
  classificationList: function (e) {
    app.classificationList(e, this)
  },
  orderData: function() {
    let that = this
    get('/hd/bargainLists' + '?page=' + that.data.page + '&channel=' + 7, {}, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        that.setData({
          ad: res.data.data.ad,
          item: res.data.data.item,
          page: that.data.page + 1,
          share: res.data.data.share
        })
        if (that.data.title == '拼团') {
          that.setData({
            ad: res.data.data.adApp
          })
        }
      } else {}
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  detail: function(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url + '?' + 'id' + '=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
    
    })
    that.orderData()
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
    let that = this
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
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
    let that = this
    if (this.data.isHaveMore) {
      get('/hd/bargainLists' + '?page=' + that.data.page + '&channel=' + 7, {}, (res) => {
        if (res.data.code == 200) {
          console.log(res)
          that.setData({
            item: that.data.item.concat(res.data.data.item),
            page: res.data.data.item.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.item.length > 0 ? true : false
          })
        } else {

        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }

  },
  onShareAppMessage: function() {
    let that = this
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route;

    var options = currentPage.options;
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')
    } catch (e) {}
    console.log("/page/Yuemall/pages/BargainPriceList/BargainPriceList?url=" + that.data.url + '&title=' + that.data.title)
    return {
      title: that.data.share.title,
      imageUrl: that.data.share.img,
      path: "/page/Yuemall/pages/BargainPriceList/BargainPriceList?url=" + that.data.url + '&title=' + that.data.title
    }
  }
})