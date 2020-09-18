// page/Yuemall/pages/newZone/newZone.js
import {
  post,
  retrunScene,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    isHaveMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options)
    if (options.userLayer != '') {
      that.setData({
        userLayer: options.userLayer 
      })
    }
    this.dataList()
    this.list()
  },
  dataList: function () {
    let that = this
    post('/app/getPotentialUserDetail', {
      // mid: 648046,
      userLayer: that.data.userLayer ,
      mid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : '',
    }, (res) => {
      console.log(res, 'zrrr')
      if (res.data.code == 200) {
        that.setData({
          CouponInfo: res.data.data.CouponInfo,
          is_send: res.data.data.CouponInfo.is_send,
          productListV1: res.data.data.productListV1,
        })
        if (res.data.data.CouponInfo.end_dates != 0) {
          that.startTimer(res.data.data.CouponInfo.end_dates - res.data.data.CouponInfo.nowTime)
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  },
  list: function () {
    let that = this
    post('/app/getUserActivePorductList', {
      // mid: 648046,
      userLayer: Number(that.data.userLayer),
      page:that.data.page,
      pageSize:10,
      mid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : '',
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          productList: res.data.data,
          page:that.data.page +1 
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  },
  obtain: function (e) {
    let that = this
    let couponid = e.currentTarget.dataset.couponid
    post('/app/getUserCoupon', {
      // mid: 648046,
      cid: couponid,
      mid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : '',
    }, (res) => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        this.dataList()
      } else {
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  },
  detailSp: function (e) {
    let url = e.currentTarget.dataset.url
    console.log(url)
    wx.navigateTo({
      url: url + '?' + 'goodsId' + '=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  // 倒计时
  startTimer: function (totalSecond) {
    console.log(totalSecond)
    let that = this
    // 倒计时
    var totalSecond = totalSecond;
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;
      // 天位
      var dr = Math.floor((second) / 86400)
      var drStr = dr.toString();
      if (drStr.length == 1) drStr = '0' + drStr;
      // 小时位
      var hr = Math.floor((second - dr * 86400) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - dr * 86400 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - dr * 86400 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownDay: drStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.setData({
          countDownDay: '0',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });

      }
    }.bind(this), 1000);


  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if (that.data.isHaveMore) {
      post('/app/getUserActivePorductList' , {
        // mid: 648046,
        userLayer: Number(that.data.userLayer),
        page: that.data.page,
        pageSize: 10,
      mid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : '',
      }, (res) => {
        if (res.data.code == 200) {
          let order = that.data.order;
          that.setData({
            productList: that.data.productList.concat(res.data.data),
            page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.length > 0 ? true : false
          })
        } else {

        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})