// page/Yuemall/pages/HalfPrice/HalfPrice.js
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
    isHaveMore: true,
    page: 1,
    pageSize: 10,
    authorizationStatus: false
  },
  dataList: function () {
    let that = this
    wx.showLoading()
    post('/mall/nineShop', {
      uid: wx.getStorageSync('uid'),
      page: that.data.page,
      pageSize: that.data.pageSize
    }, (res) => {
      if (res.data.code == 200) {
        let data = res.data.data.goodinfo
        that.setData({
          list: data,
          page: that.data.page + 1,
          // ad: res.data.data.backImg
        })
        setTimeout(function () {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.dataList()
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
  Details: function (e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid + '&type=' + 'half'
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if (this.data.isHaveMore) {
      post('/mall/nineShop', {
        uid: wx.getStorageSync('uid'),
        page: that.data.page,
        pageSize: that.data.pageSize,
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data.goodinfo),
            page: res.data.data.goodinfo.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.goodinfo.length > 0 ? true : false
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
  onShareAppMessage: function () {
    let that = this
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route;

    var options = currentPage.options;
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')
    } catch (e) { }
    return {
      title: that.data.share.title,
      imageUrl: that.data.share.img,
      path: "/page/Yuemall/pages/RankingList/RankingList?reCode="+value
    }
  }
})