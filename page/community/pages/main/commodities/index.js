// page/community/pages/main/commodities/index.js
const app = getApp()
import {
  get,
  post,
  relations,
  retrunScene,
} from '../../../../../utils/util.js';
let barrageTimerList = [] // 定时器倒计时

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [1, 2, 1, 1],
    top: '',
    ERM: true,
    time: false,
    sharelayer: false,
    community: false, //分享群
    room_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.navTop((res) => {
      console.log(res)
      this.setData({
        top: res.navTop
      })
    })

  },

  onShow: function () {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      if (options.room_id) {
        console.log(options.room_id, '3333333333')
        that.setData({
          room_id: options.room_id,
        })
        this.getShare()
      }
      this.getData()
      console.log(this.data.room_id, '111111111111')
    } else {
      this.VerificationCode()
    }
    this.getQList()
    // 清除倒计时
    barrageTimerList.forEach((item, index) => {
      clearInterval(item)
    })
    barrageTimerList = []
    app.globalData.isSetList = false
  },
  // 倒计时

  startTimer: function (totalSecond) {
    let that = this
    // 倒计时
    var totalSecond;
    // totalSecond = that.data.statrstime
    totalSecond = totalSecond
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = dayStr;

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

      this.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
        countDownDay: day
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
          countDownDay: '0'
        });

      }
    }.bind(this), 1000);
    barrageTimerList.push(interval)
  },
  getQList: function () {
    let that = this
    post('/community/group/groupActivationList', {
      uid: wx.getStorageSync('uid'),
      // uid: 67,
      type: 1,
      page: 1,
      pageSize: 10,
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          listQ: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  },
  getData: function () {
    let that = this
    post('/mall/community/communityAdPic', {
      uid: wx.getStorageSync('uid'),
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    post('/mall/community/goodsList', {
      uid: wx.getStorageSync('uid'),
    }, (res) => {
      if (res.data.code == 200) {
        if (res.data.data.activityStartTime != 0 && res.data.data.nowTime < res.data.data.activityStartTime) {
          that.setData({
            time: 1
          })
          console.log(res.data.data.nowTime - res.data.data.activityStartTime, '===============')
          that.startTimer(res.data.data.activityStartTime - res.data.data.nowTime)
        } else if (res.data.data.activityEndTime != 0 && res.data.data.nowTime < res.data.data.activityEndTime) {
          that.setData({
            time: 2
          })
          that.startTimer(res.data.data.activityEndTime - res.data.data.nowTime)
          console.log(res.data.data.activityEndTime - res.data.data.nowTime, '===============0000000')

        }
        that.setData({
          goodList: res.data.data.list,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  goDetail(e) {
    console.log(e)
    let that = this
    let goodsId = e.currentTarget.dataset.goodid
    let activityId = e.currentTarget.dataset.activityid
    wx.navigateTo({
      url: '/page/community/pages/main/communityDetail/communityDetail?goodsId=' + goodsId + '&activityId=' + activityId + '&room_id' + '',
    })
  },
  // 手机号验证码
  VerificationCode: function () {
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber=' + that.data.reCode
    })
  },
  // 页面内分享
  onShare: function (e) {
    let that = this
    that.setData({
      room_id: e.currentTarget.dataset.room_id
    })
    console.log(e.currentTarget.dataset.room_id, '00000000000000000')
    if (wx.getStorageSync('uid')) {
      this.setData({
        sharelayer: true,
        community: false,
      })
      this.getShare()
    } else {
      this.VerificationCode()
    }
  },
  getShare() {
    let that = this
    this.setData({
      room_id: that.data.room_id
    })
    post('/mall/community/goodsListWechatShare', {
      uid: wx.getStorageSync('uid'),
      roomId: that.data.room_id,
    }, (res) => {
      console.log(res)
      if (res) {
        console.log(res,'oooooo')
        that.setData({
          title: res.data.title,
          showImg: res.data.showImg,
        })
        console.log(res.data.showImg,that.data.showImg)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    post('/mall/community/goodsListPosterShare', {
      uid: wx.getStorageSync('uid'),
      roomId: that.data.room_id,
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          img: res.data.img,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  goPoster: function () {
    let that = this
    console.log(this.data.img, '================-----------')
    wx.previewImage({
      current: '',
      urls: [this.data.img]
    })
  },

  // 关闭分享
  shareLayerClosed: function () {
    this.setData({
      sharelayer: false
    })
  },
  // 群分享弹窗
  shareBtn: function () {
    if (wx.getStorageSync('uid')) {
      if (this.data.room_id) {
        console.log('8888888888888')
        this.setData({
          sharelayer: true,
        })
      } else {
        this.setData({
          community: true
        })
      }
    } else {
      this.VerificationCode()
    }
  },
  // 关闭群分享弹窗
  closeQ() {
    this.setData({
      community: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {}
    console.log(res,this.data.showImg)
    console.log("page/community/pages/main/group/noactivation/index" + "?reCode=" + value + "&room_id=" + this.data.room_id)
    return {
      title: this.data.title,
      imageUrl: this.data.showImg,
      path: "page/community/pages/main/commodities/index" + "?reCode=" + value + "&room_id=" + this.data.room_id
    }
  },
  // 自定义导航头部高度计算
  navTop: function (callback) {
    let that = this
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = (menuButtonObject.top * 2) + 8, //胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        callback({
          navTop: navTop
        })
      },
      fail(err) {
        console.log(err);
      }
    })
  }
})