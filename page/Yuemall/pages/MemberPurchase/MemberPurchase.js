// page/Yuemall/pages/MemberPurchase/MemberPurchase.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorizationStatus:false
  },
  // 详情{
  detail:function(e){
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.id
    })
  },
  orderData:function(e){
    let that = this
    post('/app/mall/activity', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          background: res.data.data.backGround,
          goodsList: res.data.data.goodsList
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that = this;
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    that.orderData()
    wx.setNavigationBarTitle({
      title: options.name
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
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
      title: '悦旅诚品 健康生活',
      path: "/page/Yuemall/pages/MemberPurchase/MemberPurchase?reCode=" + value,
      complete: (res) => {

      }
    }
  }
})