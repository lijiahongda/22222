// page/Yuemall/pages/luckDraw/luckDraw.js
import {
  get,
  post,
  retrunScene,
  relations
} from '../../../../utils/util.js';
var app = getApp();
let barrageTimerList=[] // 定时器倒计时
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    isHaveMore: true,
    isHaveMoreN: true,
    page: 1,
    authorizationStatus: false,
    pageSizeMore: 10,
    assemble: false,
    mall: true,
    item: '',
    successCount: '',
    countDownDay: '0',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
    draw: false,
    activityId: '',
    drawId:'',
    codeNumber:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      codeNumber: options.reCode
    })
  },
  // 手机号验证码
  VerificationCode: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber=' + this.data.codeNumber
    })
  },
  drawNow: function() {
    let that = this
    if (wx.getStorageSync('uid') && wx.getStorageSync('md5Id')) { // 助力加md5（防止刷）
      //已经绑定了
      console.log('已经绑定了')
      that.godarw()
    } else {
      that.setData({
        authorizationStatus: true
      })
      that.VerificationCode()
    }
  },

  // 去助力
  godarw: function() {
    let that = this
    post('/mall/draw/helpUser', {
      draw_memberid: that.data.uidY,
      uid: that.data.md5Id,
      activityId: that.data.activityId,
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          draw: false
        })
        wx.showToast({
          title: '助力成功啦~',
          icon: 'success',
        })
      } else {
        that.setData({
          draw: false
        })
        wx.showToast({
          title: '助力失败',
          icon: 'success',
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 判断是否助力
  darwData: function() {
    let that = this
    console.log(that.data.activityId)
    post('/mall/draw/getHelpInfo', {
      uid: wx.getStorageSync('uid'),
      draw_memberid: that.data.uidY,
      activityId: that.data.activityId,
      // draw_memberid: 605640,
      // activityId:4
    }, (res) => {
      if (res.data.code == 200) {
        if (res.data.data.status == 1) {
          that.setData({
            dataZ: res.data.data,
            status: res.data.data.status,
            draw: true
          })
        } else {
          that.setData({
            draw: false
          })
        }
      } else {}
      wx.hideLoading()
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  getMall: function() {
    let that = this;
    that.setData({
      mall: true,
      assemble: false,
      isHaveMoreN: true,
      page: 1
    })
    that.dataList()
  },
  getAssemble: function() {
    let that = this;
    that.setData({
      assemble: true,
      mall: false,
      isHaveMore: true,
      page: 1
    })
    that.getMyList()

  },

  // banner
  bannerData: function() {
    let that = this
    post('/mall/draw/index', {
      drawId: that.data.drawId
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          banner: res.data.data.imglist
        })
        console.log('---------')
      } else {}
      wx.hideLoading()
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 商品列表
  dataList: function() {
    let that = this
    wx.showLoading({
      title: '加载中',
    });
    post('/mall/draw/list', {
      page: 1,
      pageSize: 10,
      drawId: that.data.drawId
    }, (res) => {
      if (res.data.code == 200) {
        wx.hideLoading();
        that.setData({
          item: res.data.data,
          page: that.data.page + 1,
        })
        console.log('---------')
      } else {}
      wx.hideLoading()
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 我的抽奖
  getMyList: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    post('/mall/draw/getMyDrawList', {
      uid: wx.getStorageSync('uid'),
      page: 1,
    }, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        console.log(res.data.data)
        for (var v = 0; v < res.data.data.length; v++) {
          if (res.data.data[v].lottery_time != 0) {
            let timestamp = Date.parse(new Date());
            that.startTimer(res.data.data[v].lottery_time - Number(timestamp / 1000), v)
          }
        }
        that.setData({
          list: res.data.data,
          page: that.data.page + 1
        })

      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    if (that.data.mall) {
      if (this.data.isHaveMore) {
        wx.showLoading()
        post('/mall/draw/list', {
          page: that.data.page,
          pageSize: 10,
          drawId: that.data.drawId
        }, (res) => {
          if (res.data.code == 200) {
            that.setData({
              item: that.data.item.concat(res.data.data),
              page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.length > 0 ? true : false
            })
          } else {

          }
          wx.hideLoading()
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      } else {
        // wx.showToast({
        //   title: '没有更多了！',
        //   icon: 'none'
        // })
      }
    } else {
      if (this.data.isHaveMoreN) {
        wx.showLoading()
        post('/mall/draw/getMyDrawList', {
          uid: wx.getStorageSync('uid'),
          page: that.data.page
        }, (res) => {
          if (res.data.code == 200) {
            that.setData({
              list: that.data.list.concat(res.data.data),
              page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMoreN: res.data.data.length > 0 ? true : false
            })
          } else {

          }
          wx.hideLoading()
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      } else {
        // wx.showToast({
        //   title: '没有更多了！',
        //   icon: 'none'
        // })
      }
    }

  },
  detail: function(e) {
    let url = e.currentTarget.dataset.url
    console.log(url)
    wx.navigateTo({
      url: url + '?' + 'activityId' + '=' + e.currentTarget.dataset.id,
    })
    wx.setStorageSync('where', false);
  },
  godetail: function(e) {
    let url = e.currentTarget.dataset.url
    console.log(url)
    wx.navigateTo({
      url: url + '?' + 'activityId' + '=' + e.currentTarget.dataset.id,
    })
    wx.setStorageSync('where', true);
  },
  
  // 倒计时
  startTimer: function(totalSecond, v) {
    let that = this
    // 倒计时
    var totalSecond = totalSecond;
    var type = type
    console.log(totalSecond)
    if (totalSecond == 0) {
      console.log('daojishijieshu')
      that.setData({})
    } else {
      if (interval){
        clearInterval(interval);
      }
        var interval = setInterval(function() {
        // 秒数
        var second = totalSecond;
        // 天数位
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length == 1) dayStr =  dayStr;

        // 小时位
        var hr = Math.floor((second - day * 3600 * 24) / 3600);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;

        // 分钟位
        var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;

        // 秒位
        var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;
        this.data.list[v].countDownDay =  dayStr 
          // = '0' + dayStr
        this.data.list[v].countDownHour = hrStr;
        this.data.list[v].countDownMinute = minStr;
        this.data.list[v].countDownSecond = secStr;
        this.setData({
          list: this.data.list
        });
        totalSecond--;
        if (totalSecond < 0) {
          clearInterval(interval);
          this.data.list[v].countDownDay = '0';
          this.data.list[v].countDownHour = '00';
          this.data.list[v].countDownMinute = '00';
          this.data.list[v].countDownSecond = '00';
        }

      }.bind(this), 1000);
      barrageTimerList.push(interval)
    }

  },
  // 倒计时
  AnotherRoundstartTimer: function(totalSecond, v) {
    let that = this
    // 倒计时
    var totalSecond;
    // totalSecond = that.data.statrstime
    totalSecond = totalSecond
    var interval = setInterval(function() {
      // 秒数
      var second = totalSecond;
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      // this.data.list[v].countDownDay = '0';

      this.data.list[v].countDownHour = hrStr;
      this.data.list[v].countDownMinute = minStr;
      this.data.list[v].countDownSecond = secStr;
      this.setData({
        list: this.data.list
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.data.list[v].countDownDay = '0';
        this.data.list[v].countDownHour = '00';
        this.data.list[v].countDownMinute = '00';
        this.data.list[v].countDownSecond = '00';
      }
    }.bind(this), 1000);
  },

  onShow: function() {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    //扫码参数分解
    console.log(options)
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        that.setData({
          activityId: sceneObj.A,
          drawId: sceneObj.D,
          uidY: sceneObj.U,
          reCode: sceneObj.R
        })
      });
    }
    if (options.drawId) {
      that.setData({
        activityId: options.activityId,
        drawId: Number(options.drawId),
        uidY: options.uid
      })
    } else {
      that.setData({
        drawId: 2
      })
    }
    this.bannerData()
    this.darwData()
    if (wx.getStorageSync('uid') && wx.getStorageSync('md5Id')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false,
        md5Id: wx.getStorageSync('md5Id')
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      that.setData({
        authorizationStatus: true,
      })
      wx.hideShareMenu()
    }
    if (options.when && options.when == 1) {
      this.getMall()
    } else if (wx.getStorageSync('where') == true) {
      console.log('我从我的抽奖出去的')
      this.getAssemble()
    } else if (wx.getStorageSync('where') == false){
      console.log('我从商品列表出去的')
      this.getMall()
    }
    
    // 清除倒计时
    barrageTimerList.forEach((item, index) => {
      clearInterval(item)
    })
    barrageTimerList = []
  },
  onShareAppMessage: function(res) {
    let that = this
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {

    }
    console.log(res)
    console.log("page/assembleFree/page/InitiateGroup/InitiateGroup" + "?reCode=" + value + "&id=" + res.target.dataset.id + '&type=' + 2)
    return {
      title: that.data.share.title,
      imageUrl: that.data.share.img,
      path: "page/Yuemall/pages/luckDraw/luckDraw" + "?reCode=" + value + "&drawId=" + that.data.drawId
    }

  },
})