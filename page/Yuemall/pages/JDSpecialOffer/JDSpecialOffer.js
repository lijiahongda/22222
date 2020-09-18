// page/Yuemall//pages/JDSpecialOffer/JDSpecialOffer.js
import {
  get,
  post,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    
    that.selectComponent("#jdCom")._onOption(options)
    console.log(options,'-+++--')
    that.setData({
      issetType: true,
      channelId: options.channelId,
      name: options.name,
      typeId: options.id,
      scrollId: 'd' + options.id
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
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
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
  },

 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.selectComponent("#jdCom")._onReachBottom()
    
  },
  onShareAppMessage: function() {
    let that = this
    let nickname = wx.getStorageSync('nickname');
    wx.getStorage({
      key: 'uid',
      success: function(res) {
        that.setData({
          uid: res.data
        });
        wx.getStorage({
          key: 'token',
          success: function(res) {
            that.setData({
              token: res.data
            });
          }
        });
      }
    });
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route;

    var options = currentPage.options;
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {

    }
    return {
      title: that.data.top100.title,
      imageUrl: that.data.top100.showImg,
      path: "/page/Yuemall/pages/JDSpecialOffer/JDSpecialOffer" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid') + '&name=' + that.data.name + '&channelId=' + that.data.channelId + '&id=' + that.data.typeId
    }
  }
})