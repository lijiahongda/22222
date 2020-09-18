// page/Yuemall/pages/FacialMask/FacialMask.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rushStatus:'距离活动结束',
    countDownDay:'0',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond:'00'
  },
  detail:function(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + this.data.goodsId
    })
  },
  //数据
  orderData:function(){
    let that = this
    post('/app/mall/newActivity', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          backGround: res.data.backGround,
          goodsId: res.data.goodsId,
          shareMes: res.data.shareMes,
          statrstime: (res.data.endTime - res.data.nowTime),
        })
        console.log(res.data.endTime - res.data.nowTime)
        that.startTimer()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true)
  },
  // 倒计时
  startTimer: function () {
    let that = this
    // 倒计时
    var totalSecond;
    totalSecond = that.data.statrstime
    var interval = setInterval(function () {
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
        countDownDay:day
      });
      totalSecond--;
      if (totalSecond < 0) {
        that.assistantList()
        clearInterval(interval);
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
          countDownDay:'0'
        });

      }
    }.bind(this), 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    that.orderData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route
    var options = currentPage.options
    var value = ''
    let _this = this;
    let nickname = wx.getStorageSync('nickname');
    try {
      value = wx.getStorageSync('selfReCode')
    } catch (e) {
      // Do something when catch error
    }
    return {
      title: _this.data.shareMes.remind,
      imageUrl: _this.data.shareMes.img,
      path: "/page/Yuemall/pages/SaveMoneyBuy/SaveMoneyBuy?reCode=" + value,
      complete: (res) => {

      }
    }
  }
})