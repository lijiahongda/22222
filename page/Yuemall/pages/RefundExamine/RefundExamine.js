// page/Yuemall//pages/RefundExamine/RefundExamine.js
import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exmainshow:false,//上传物流信息
    waitshen:false, //等待商家审核
    changes:'',
    services:false,
    service:false,
    time:'',
    splAddr:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
      that.setData({
        changes:options.changes,
        ordersn:options.ordersn
      })
    that.initdata(options.ordersn)
    console.log(this.data.splAddr)
    
  },
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
      var hr = Math.floor((second-dr*86400) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - dr * 86400- hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second -dr*86400- hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownDay:drStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.setData({
          countDownDay:'00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });

      }
    }.bind(this), 1000);
   
    
  },

  //秒数 转化成天、小时、秒
  turnTimeFormat: function (seconds) {
    let day = Math.floor(seconds / 60 / 60 / 24);
    let hours = Math.floor(seconds / 60 / 60 % 24);
    let min = Math.floor(seconds / 60 % 60);
    let sec = Math.floor(seconds % 60);
    return {
      day: day,
      time: +hours + ':' + min + ':' + sec
    }
  },
  initdata(ordersn){
    let data = {
      subOrderNo:ordersn
    }
    post('/app/member/refundInfoNew', data, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        let lists=res.data.data.map(item=>{
          console.log(item)
          let timestamp = Date.parse(new Date())/1000;
          let time = item.deadTime - timestamp
          console.log(timestamp)
          this.setData({
            lists:item,
            refundType: item.refundType,
            deadTime: item.deadTime,
            time:time,
            expressInfo: item.expressInfo,
            splAddr: item.splAddr,
            refundreason:item.subTitle,
            orderProcess: item.orderProcess,
            cancelType: item.cancelType
          })
          console.log(this.data.deadTime)
          
        })
        this.startTimer(this.data.time)
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  expressmsg(){
    let that=this
    that.setData({
      services:true
    })
  },
  bindinput(e){
    let that=this
    that.setData({
      expressnum:e.detail.value
    })
  },
  // 选择快递信息
  chooseexpres:function(){
    let that=this
    that.setData({
      services:false,
      service:true
    })
    let data = {}
    post('/app/member/refundExpress', data, (res) => {
      if (res.data.code == 200) {
        let expresslist = res.data.data
        expresslist.filter(item => {
          item.checked = false
        })
        console.log(expresslist)
        this.setData({
          expresslist: expresslist
        })
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  radioChange(e){
    let that = this
    console.log(e)
    that.setData({
      reasonText: e.detail.value,
      service: false,
      services:true
    })
  },
  closeService(){
    this.setData({
      service: false,
      services: false
    })
  },
  // 确定添加快递信息
  submit:function(){
    let that = this
    let data = {
      subOrderNo:that.data.ordersn,
      expressNo:that.data.expressnum,
      expressName:that.data.reasonText,
    }
    post('/app/member/uploadExpress', data, (res) => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    that.setData({
      service:false,
      services:false,
      waitshen:true
    })
    this.initdata(this.data.ordersn)
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
    let that = this
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    that.initdata(that.data.ordersn)

    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
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

  }
})