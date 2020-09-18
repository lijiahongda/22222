import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    page: 1,
    uid:'',
    token:''
  },
  getOrderList: function () {
    var that = this;
    get('/app/member/rechargeOrderList/' + that.data.page, {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          orderData: res.data.list,
          page: that.data.page + 1
        })
      } else { }
    }, 1, that.data.token, true, that.data.uid)

  },
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })
    this.getOrderList();
  },
  onPullDownRefresh: function () {
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  onShow:function(){
    this.getOrderList();
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    var that = this
    get('/app/member/rechargeOrderList/' + that.data.page, {}, (res) => {
      if (res.data.code == 200) {
        let orderData = that.data.orderData;
        for (var itemKey in res.data.list) {
          orderData.push(res.data.list[itemKey]);
        }
        that.setData({
          orderData: orderData,
          page: that.data.page + 1,
        })
      } else { }
    }, 1, that.data.token, true, that.data.uid)
  },
})