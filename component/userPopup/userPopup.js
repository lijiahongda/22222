import {
  post
} from '../../utils/util.js';
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
  },
  created: function () {
    let that = this
    // that.getData()
    
  },


  /**
   * 组件的初始数据
   */
  data: {
    list: {},
    // isRedPopup: wx.getStorageSync('uid')?false:true
    isRedPopup:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 接收父传来的参数  父页面的onload
    _onOption: function (options, codeNumber,type) {
      let that = this
      console.log(options, codeNumber, '子组件option',type,'====')
      if (options.isPopUp == 1){
        that.setData({
          isRedPopup: true
        })
      }else{
        that.setData({
          isRedPopup: false
        })
      }
      if (type == 1){
        that.setData({
          urlType: options.urlType,
          userLayer: options.userLayer,
          couponInfo: options.couponInfo,
          couponid: options.couponInfo.couponid,
          popType: options.popType,
          codeNumber: codeNumber,
        })
        if (options.couponInfo.end_dates != 0) {
          that.startTimer(options.couponInfo.end_dates - options.couponInfo.nowTime)
        }
      }else if(type == 2){
        console.log(that.data.userLayer)
        that.setData({
          popType: options.popType,
          userLayer: 2,
          urlType: options.urlType,
          couponInfo: options.CouponInfo,
          couponid: options.CouponInfo.couponid,
          codeNumber: codeNumber,
        })
        // if (options.CouponInfo.end_dates != 0) {
        //   that.startTimer(options.CouponInfo.end_dates - options.CouponInfo.nowTime)
        // }
      }else{
        that.setData({
          popType: options.popType,
          userLayer:type,
          couponInfo: options.couponInfo,
          couponid: options.couponInfo.couponid,
          codeNumber: codeNumber,
        })
        console.log(this.data.userLayer, this.data.popType)
      }
      
    },
    // 手机号验证码
    VerificationCode: function () {
      let that = this
      console.log(that.data.codeNumber,'----------------')
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber' + that.data.codeNumber
      })
    },
    // 关闭大红包
    closeisredPopup: function () {
      this.setData({
        isRedPopup: false
      })
    },
    // 分类列表
    go: function (e) {
      if (!wx.getStorageSync('uid')){
        this.VerificationCode()
      }else{
        wx.navigateTo({
          url: '/page/Yuemall/pages/newZone/newZone'
        })
        this.setData({
          isRedPopup: false
        })
      }
      console.log(e)
    },
    goNew:function(e){
      console.log(e,'99999999999999')
      let type = e.currentTarget.dataset.type
      let couponid = e.currentTarget.dataset.couponid
      let urltype = e.currentTarget.dataset.urltype
      let userLayer = e.currentTarget.dataset.userlayer
      if (type == 4 || urltype == 1) {
        wx.navigateTo({
          url: '/page/Yuemall/pages/newZone/newZone?couponid=' + couponid + '&userLayer=' + userLayer
        })
      } else {
        wx.navigateTo({
          url: '/page/Yuemall/pages/newZoneN/newZone?couponid=' + couponid + '&userLayer=' + userLayer
        })
      }
      this.setData({
        isRedPopup: false
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
  }
})