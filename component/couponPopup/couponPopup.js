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


  },


  /**
   * 组件的初始数据
   */
  data: {
    list: {},
    iscouponPopup: false,
    mechanismId: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onOption: function (option) {
      let that = this
      console.log(option, 'option')
      that.setData({
        mechanismId: option,
      })
      if (option != '') {
        that._getData()
      }
    },
    _getData() {
      let that = this
      console.log('45678909876', that.data.mechanismId)
      post('/coupon/info', {
        mechanismId: that.data.mechanismId
      }, (res) => {
        console.log(res, 'zrrr')
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data,
            iscouponPopup: true
          })
        } else {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none'
          // })
          that.setData({
            iscouponPopup: false
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    },
    // 禁止弹框所在页面滚动
    preventTouchMove() { return },
    // 点击领取优惠券
    receiveZ() {
      let that = this
      console.log('45678909876')
      post('/coupon/receive', {
        mechanismId: that.data.mechanismId
      }, (res) => {
        console.log(res, 'zrrr')
        if (res.data.code == 200) {
          wx.showToast({
            title: '领取成功',
            icon: 'none'
          })
          that.setData({
            iscouponPopup: false
          })
        } else {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none'
          // })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    },
    // 关闭优惠券弹窗
    closecouponPopup: function () {
      this.setData({
        iscouponPopup: false
      })
    }
  }
})