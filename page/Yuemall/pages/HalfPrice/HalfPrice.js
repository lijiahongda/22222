import {
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
  onLoad: function (options) {
    let that =this
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
    
  },
  // 子组件传递来的参数
  onMyEvent:function(e){
    this.setData({
      share: e.detail
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.selectComponent("#limited-time")._onReachBottom()
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
      path: "/page/Yuemall/pages/HalfPrice/HalfPrice?reCode="+value
    }
  }
})