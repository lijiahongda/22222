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

  /**
   * 组件的初始数据
   */
  data: {
    couponList:[],
    couponListId:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onOption: function (option, couponListId){
      console.log(']]]]')
      let that = this
      console.log(option, couponListId,'option')
      that.setData({
        couponList:option,
        couponListId: couponListId
      })
    },
    //券列表
    getCouponList: function () {
      let that = this
      let uid = 0
      if (wx.getStorageSync('uid')) {
        uid = wx.getStorageSync('uid')
      } else {
        uid = 0
      }
      post('/mall/V2/getCouponList', {
        couponActivityId: that.data.couponListId,
        // couponActivityId: 1,
        uid: uid
      }, (res) => {
        if (res.data.code == 200) {
          console.log(res.data)
          that.setData({
            couponList: res.data.data.list,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    },
    //点击领取
    receive: function (e) {
      console.log(e)
      let that = this
      let couponState = e.currentTarget.dataset.couponstate
      if(wx.getStorageSync('uid')){
        if (couponState == 0 ){
          post('/mall/sendCoupon', {
            uid: wx.getStorageSync('uid'),
            cid: e.currentTarget.dataset.cid
          }, (res) => {
            if (res.data.code == 200) {
              wx.showToast({
                title: '领取成功！',
                icon: 'none'
              })
              that.getCouponList()
            } else if (res.code == 400) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1000
              })
            }
          }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
        }else{
          wx.showToast({
            title: '您已领取！',
            icon: 'none'
          })
        }
      }else{
        wx.navigateTo({
          url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
        })
      }
    },
    
  }
})
