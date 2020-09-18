import {
  get,
  post,
  relations
} from '../../../../utils/util.js';
var timer = require('../../../../utils/wxTimer-master/wxTimer.js')
var app = getApp().globalData
timer = app.timer;
var interval 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SeTupSuccess: false,
    AbolishSuccess: false,
    wxTimer: '',
    wxTimerSecond: '',
    wxTimerList: {},
    time: '00:00:10',
    orderData: [],
    uid: '',
    token: '',
    currentTab: 0, //预设当前项的值,
    list: [],
    page: 1,
    pageSize: 10,
    orderType: 0,
    isHaveMore: true,
    authorizationStatus:false
  },
 
  // 提醒我
  RemindingMe: function(e) {
    let that = this
    if (wx.getStorageSync('isBinding') == 2) {
      wx.switchTab({
        url: '/page/Mall/YueMall'
      })
    }
    post('/app/mall/remind', {
      remindTime: e.currentTarget.dataset.time,
      goodId: e.currentTarget.dataset.id,
      uid: wx.getStorageSync('uid')
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          page: 1
        })
        that.getOrderList()

      } else {

      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true)
    if (e.currentTarget.dataset.isremid == 0) {
      that.setData({
        SeTupSuccess: true,
        AbolishSuccess: false
      })
    } else {
      that.setData({
        AbolishSuccess: true,
        SeTupSuccess: false
      })
    }
    setTimeout(function() {
      that.setData({
        AbolishSuccess: false,
        SeTupSuccess: false
      })
    }, 1000);
  },
  //滚动监听
  scroll: function(e) {
    var that = this,
      scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  // 标签切换
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        page: 1,
        isHaveMore: true
      })
    }
    this.getOrderList()

  },
  // 订单详情
  orderDetails: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/RushBuyDetail/RushBuyDetail?goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid + '&activityId=' + e.currentTarget.dataset.activityid
    })
  },
  GoShopping: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid + '&activityId=' + e.currentTarget.dataset.activityid
    })
    console.log('/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid + '&activityId=' + e.currentTarget.dataset.activityid)
  },
  // 倒计时
  startTimer: function(type) {
    let that = this
    let date = ''
    var totalSecond;
    if (that.data.state == 0) { //明日预告
      date = new Date((that.data.flashStartTime)); // （明日）
      let h = date.getHours() + ':';
      let m = date.getMinutes();
      that.setData({
        tomorrowTime: (h + m + ':00')
      })
    } else if (type == 0) { //正在疯抢
      totalSecond = that.data.flashEndTime - that.data.nowTime; //结束时间 - 现在时间 （距开始时间）
    } else if (type == 1) { //即将开抢
      totalSecond = that.data.flashStartTime - that.data.nowTime; //结束时间 - 现在时间 （距结束时间）
    }
    console.log(totalSecond)
    this.setData({
      totalSecond: totalSecond
    })
    if (that.data.currentTab == 0 || that.data.currentTab == 1) {
      interval = setInterval(function() {
        // 秒数
        var second = totalSecond;
        // 小时位
        var hr = Math.floor((second) / 3600);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;

        // 分钟位
        var min = Math.floor((second - hr * 3600) / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;

        // 秒位
        var sec = second - hr * 3600 - min * 60;
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;

        this.setData({
          countDownHour: hrStr,
          countDownMinute: minStr,
          countDownSecond: secStr,
        });
        totalSecond--;
        if (totalSecond < 0) {
          that.getOrderList()
          clearInterval(interval);
          this.setData({
            countDownHour: '00',
            countDownMinute: '00',
            countDownSecond: '00',
          });

        }
      }.bind(this), 1000);

    }
  },

  //秒数 转化成天、小时、秒
  turnTimeFormat: function(seconds) {
    let day = Math.floor(seconds / 60 / 60 / 24); 
    let hours = Math.floor(seconds / 60 / 60 % 24); 
    let min = Math.floor(seconds / 60 % 60); 
    let sec = Math.floor(seconds % 60);
    return {
      day: day,
      time: +hours + ':' + min + ':' + sec
    }
  },
  //  获取列表
  getOrderList: function() {
    let that = this
    post('/mall/flashSale', {
      page: that.data.page,
      pageSize: that.data.pageSize,
      type: that.data.currentTab,
      uid: wx.getStorageSync('uid'),
      fromType:7
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          flashEndTime: res.data.endTime, //结束时间
          flashStartTime: res.data.startTime, //开始时间
          nowTime: res.data.nowTime, //当前时间
          list: res.data.data,
          page: that.data.page + 1,
          type: res.data.type,
          share: res.data.share
        })
        if (res.data.data.length != 0) { // 抢购列表无数据
          clearInterval(interval);
          that.setData({
            countDownHour: '00',
            countDownMinute: '00',
            countDownSecond: '00'
          })
          that.startTimer(res.data.type)
        }
      } else {

      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 去首页
  goMall: function() {
    wx.navigateBack({})
  },
  onLoad: function(options) {
    let that = this
    that.getOrderList();
  },
  onPageScroll: function(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    if (this.data.isHaveMore) {
      post('/mall/flashSale', {
        page: that.data.page,
        pageSize: that.data.pageSize,
        type: that.data.currentTab,
        uid: wx.getStorageSync('uid')
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data),
            page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.length > 0 ? true : false
          })
        } else {

        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true,0,4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  },
  onPullDownRefresh: function() {

  },
  onShow: function() {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    that.setData({
      page: 1
    })
    relations(options.reCode);
    let interval = setInterval(function() {
      let m = new Date().getMinutes();
      if (m = 0) {
        that.getOrderList()
      }
    }, 60000)
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
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
      path: "/page/Yuemall/pages/RushBuyList/RushBuyList"
    }
  }
})