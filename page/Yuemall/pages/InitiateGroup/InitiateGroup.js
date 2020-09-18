// page/Mall/pages/InitiateGroup/InitiateGroup.js
import {
  get,
  post,
  wxLogin
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      image: '',
      name: '',
      num: 1,
      time: 65602
    }],
    share_title:'',
    countDownDay: '0',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00'
  },
  detaildata: function() {
    let that = this
    post('/hd/getOrdersnTeamInfo', {
      uid: that.data.uid,
      ordersn: that.data.ordersn,
      type: that.data.type
    }, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        console.log(res)
        let data = res.data.data
        console.log(data.productInfo)
        that.setData({
          productInfo: data.productInfo,
          goods_img: data.productInfo.goods_img,
          teamStatus: data.teamStatus,
          team: data.team,
          countDown: data.countDown,
          teamid: data.productInfo.team_id,
          id: data.productInfo.found_id,
          share_title: data.share
        })
        if (data.teamStatus == 1) { //进行中
          console.log('===')
          that.startTimer(data.countDown)
        } 
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 拼团商品详情
  AssembleDetail: function (e) {
    wx.redirectTo({
      url: '/page/Yuemall/pages/AssembleDetail/AssembleDetail?teamid=' + e.currentTarget.dataset.id + ' & skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  // 初始化数据
  initData: function () {
    let that = this
    get('/hd/assemble?page=' + 1 +'&channel='+7, {}, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          assembleList: res.data.data.item
        })
      } else {

      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 查看订单
  lookorder: function() {
    wx.navigateTo({
      url: '/page/oneself/pages/orderDetail/orderDetail?ordersn=' + this.data.ordersn
    })
  },
  orderDetail: function() {
    wx.navigateTo({
      url: '/page/oneself/pages/orderDetail/orderDetail?ordersn=' + this.data.ordersn
    })
  },
  // 再开一团
  AnotherRound: function() {
    wx.redirectTo({
      url: '/page/Yuemall/pages/AssembleDetail/AssembleDetail?teamid=' + this.data.teamid,
    })
  },
  // 查看更多福利
  MoreBenefits: function() {
    wx.redirectTo({
      url: '/page/Yuemall/pages/BargainPriceList/BargainPriceList',
    })
  },
  // 去拼单详情
  GoGroupDetail: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/GroupDetail/GroupDetail',
    })
  },
  // 砍价拼团查看更多列表
  BargainPriceList: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/BargainPriceList/BargainPriceList?title=' + e.currentTarget.dataset.title + '&url=' + e.currentTarget.dataset.url,
    })
  },
  // 砍价商品详情
  BargainDetails: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/BargainDetails/BargainDetails',
    })
  },
  // 倒计时
  startTimer: function(totalSecond) {
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

      this.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
        countDownDay: day
      });
      totalSecond--;
      if (totalSecond < 0) {
        that.detaildata()
        clearInterval(interval);
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
          countDownDay: '0'
        });

      }
    }.bind(this), 1000);
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
      this.data.list[v].countDownHour = hrStr;
      this.data.list[v].countDownMinute = minStr;
      this.data.list[v].countDownSecond = secStr;
      this.setData({
        list: this.data.list
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.data.list[v].countDownHour = '00';
        this.data.list[v].countDownMinute = '00';
        this.data.list[v].countDownSecond = '00';
      }
    }.bind(this), 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      Entrance: options.Entrance, //是从结算页进来==b,如果拼团进行中==h,如果拼团成功==s,如果拼团失败==f
      ordersn: options.ordersn,
      type: options.type,
      uid: wx.getStorageSync('uid'),
      isfail: options.isfail
    })
    console.log(options.ordersn)
    that.detaildata()
    that.initData()
    console.log(options.Entrance)
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
    if (this.data.Entrance == 'b') {
      wx.navigateBack({
        delta: 2
      })
    }
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
  // 分享图片及标题
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    let value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {

    }
    console.log(that.data.id)
    return {
      title: that.data.share_title,
      imageUrl: that.data.goods_img,
      path: "page/Yuemall/pages/GroupDetail/GroupDetail" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid') + "&id=" + that.data.id
    }
  }
})