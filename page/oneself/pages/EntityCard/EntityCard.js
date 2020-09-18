import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countdown: 60, // 验证码倒计时
    cardNum: '',
    phoneNum: ''
  },
  EntityCardNum: function(e) { // 实体卡号
    let val = e.detail.value;
    this.setData({
      cardNum: val
    });
  },
  phoneNum: function (e) { // 手机号
    let val = e.detail.value;
    this.setData({
      phoneNum: val
    });
  },
  verifyCode: function (e) { // 验证码
    let val = e.detail.value;
    this.setData({
      verifyCode: val
    });
  },
  // 倒计时
  CountDown: function() {
    let that = this;
    if (that.data.countdown != 60) {
      return;
    }

    let temp = setInterval(function() { // 倒计时
      that.setData({
        countdown: that.data.countdown - 1
      })
      if (that.data.countdown == 1) {
        that.setData({
          countdown: 60
        })
        clearInterval(temp);
      }
    }, 1000)
  },
  // 获取验证码
  getCode: function() {
    let that = this
    if (that.data.phoneNum == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      });
      return false
    }
    if (that.data.countdown != 60) {
      return;
    }
   
    //发验证码
    const codeUrl = '/app/auth/send';
    post(codeUrl, {
      mobile: that.data.phoneNum
    }, (res) => {
      if (res.data.code === 200) {
        that.CountDown()
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
  },
  // 确认绑定
  ConfirmBinding: function() {
    let that = this;
    if (that.data.cardNum == ''){
      wx.showToast({
        title: '实体卡号不能为空',
        icon:'none'
      })
      return false
    }
    if (that.data.phoneNum == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return false
    }
    post('/app/card/bind', {
      number: that.data.cardNum,
      mobile: that.data.phoneNum,
      verifyCode:that.data.verifyCode
    }, (res) => {
      if (res.data.code == 200) {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: function(res) {
            const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
            const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
            if (wxPrevPage) {
              wxPrevPage.setData({
                page: 1,
              })
              wx.navigateBack()
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: function(res) {}
        })
      }
    }, 1, that.data.token, true, that.data.uid)
  },
  onLoad: function(options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })
  },
  onShow: function() {
    wx.setStorageSync('myrequest', '');
  }
})