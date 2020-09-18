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
    that._getData()
    
  },


  /**
   * 组件的初始数据
   */
  data: {
    list: {},
    isRedPopup:''
    // isRedPopup: wx.getStorageSync('uid')?false:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onOption: function (options) {
      let that = this
      console.log(options, '子组件option aaaa')
      that.setData({
        isShowOtherPop: options
      })
      if (options == 1 && !wx.getStorageSync('uid')){
        that.setData({
          isRedPopup:true
        })
      }
    },
    _getData() {
      let that = this
      console.log('45678909876')
      post('/mall/V2/getAdvertisement', {}, (res) => {
        console.log(res,'zrrr')
        if (res.data.code == 200) {
          that.setData({
            list: res.data.res[0]
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    },
    // 手机号验证码
    // VerificationCode: function () {
    //   wx.navigateTo({
    //     url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    //   })
    // },
    // 关闭大红包
    closeisredPopup: function () {
      this.setData({
        isRedPopup: false
      })
    },
    // 分类列表
    classificationList: function (e) {
      console.log(e)
      app.classificationList(e, this)
    },
  }
})