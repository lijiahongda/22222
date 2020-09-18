// page/other/pages/YueNews/YueNews.js
import {
  get,
  post,
  retrunScene,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorizationStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this

  },
  // 去详情
  lineDetail: function(e) {
    wx.navigateTo({
      url: '/page/line/pages/detail/detail?LineId=' + e.currentTarget.dataset.id,
    })
  },
  // 去兑换
  exchange: function(e) {
    // wx.navigateTo({
    //   url: '/page/line/pages/DeductibleTravelVouchers/DeductibleTravelVouchers?productId=' + e.currentTarget.dataset.id,
    // })
    // wx.navigateTo({
    //   url: '/page/line/pages/LineRevision/superiorProducts/superiorProducts?typeStatus=' + 5 + '&id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
    // })
    // wx.navigateTo({
    //   url: '/page/Yuemall/pages/IntegralMallDatail/IntegralMallDatail?goodsId=' + e.currentTarget.dataset.id
    // })
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMallDatail/IntegralMallDatail?goodsId=' + e.currentTarget.dataset.goodsid + '&parentTypeId=' + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  orderDatail: function() {
    let that = this
    get('/app/market/linesv2', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          header: res.data.data.newHeader,
          list: res.data.data.newLists,
          // tips: res.data.data.tips
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    get('/app/mall/shareIndex', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          shareImg: res.data.data.wxUrl.imgUrl,
          title: res.data.data.wxUrl.title
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    get('/api/item/msgv2?uid=' + wx.getStorageSync('uid') + '&type=' + 1, {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          msg: res.data.data.msg
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 2);
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
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    wx.setStorageSync('myrequest', '');
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false
      })
      that.orderDatail()
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
    that.orderDatail()
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
  // onShareAppMessage: function() {
  //   let that = this
  //   let nickname = wx.getStorageSync('nickname');
  //   wx.getStorage({
  //     key: 'uid',
  //     success: function(res) {
  //       that.setData({
  //         uid: res.data
  //       });
  //       wx.getStorage({
  //         key: 'token',
  //         success: function(res) {
  //           that.setData({
  //             token: res.data
  //           });
  //         }
  //       });
  //     }
  //   });
  //   var pages = getCurrentPages() //获取加载的页面
  //   var currentPage = pages[pages.length - 1] //获取当前页面的对象
  //   var url = currentPage.route;

  //   var options = currentPage.options;
  //   var value = ''
  //   try {
  //     value = wx.getStorageSync('selfReCode')

  //   } catch (e) {

  //   }
  //   return {
  //     title: that.data.title,
  //     imageUrl: that.data.shareImg,
  //     path: "/page/other/pages/YueNews/YueNews" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid')
  //   }

  // },
})