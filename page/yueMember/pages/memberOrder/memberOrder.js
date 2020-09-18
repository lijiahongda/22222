import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    uid:'',
    token:''
  },
  goDetails: function (e) {
    wx.navigateTo({
      url: '../memberDetails/memberDetails?orderno=' + e.currentTarget.dataset.orderno
    })
  },
  //获取页面内容
  getOrderList: function () {
    var that = this;
    post('/app/member/orderList', {
      "category": 1,
      "type": 0

    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          orderData: res.data.list
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  onLoad: function (options) {
    var that =this
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })
    that.getOrderList();
   
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onShow: function () {
  },
})