// component/NewHotStyle/NewHotStyle.js
import {
  get,
  post,
  relations
} from '../../utils/util.js';
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
  },
  created: function () {
    let that = this
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onOption: function (id) {
      let that = this
      that.retypeData(id)
      this.getBlack(id)
      // let that = this
      // console.log(options, '子组件option')
      // wx.showLoading({
      //   title: '加载中',
      // })
      // that.setData({
      //   issetType: true,
      //   channelId: options.channelId,
      //   name: options.name,
      //   typeId: options.id,
      //   scrollId: 'd' + options.id,
      //   cardType: wx.getStorageSync('cardType')
      // })
      // console.log('ssss', that.data.cardType)
      // that.initData()
    },
    // 商品列表  
    retypeData: function (id) {
      let that = this
      let uid = 0
      if (wx.getStorageSync('uid')) {
        uid = wx.getStorageSync('uid')
      } else {
        uid = 0
      }
      post('/mall/V2/newActivityList', {
        id: id,
        // id: 46,
        uid: uid
      }, (res) => {
        if (res.data.code == 200) {
          console.log(res.data.data[0].goodsInfo)
          that.setData({
            list: res.data.data,
            backGround: res.data.backGround.url,
            backColor: res.data.backColor,
            couponListId: res.data.couponListId,
          })
          console.log(this.data.couponListId)
          // if (that.data.couponListId > 0) {
          //   that.getCouponList()
          // }
          wx.setNavigationBarTitle({
            title: res.data.activityName,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      post('/app/mall/mallShare', {
        uid: wx.getStorageSync('uid'),
        type: id
      }, (res) => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            top100: res.data
          })
          wx.hideLoading()
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true)
    },
     //判断是否是黑金会员
    getBlack(id) {
      let that = this,
        data = {
          uid:wx.getStorageSync('uid') ? wx.getStorageSync('uid') : 0,
          activityId:id
        }
      post('/mall/V3/blackGoldBuy', data, (res) => {
        console.log('hhhhhhhhhhhh',res.data.data)
        if (res.data.code == 200) {
          that.setData({
            isBuy: res.data.data.isBuy,
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    },
    VerificationCode: function () {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
      })
    },
    //爆款详情
    goToInfo(e) {
      if(wx.getStorageSync('uid')){
        if(this.data.isBuy == 0){
          wx.showToast({
            title: '请升级黑金VIP',
            icon: 'none',
          })
        }else{
          if (e.currentTarget.dataset.channelid == 8) {
            wx.navigateTo({
              url: '/page/Yuemall/pages/DangBookDetail/DangBookDetail?goodsId=' + e.currentTarget.dataset.goodid + '&skuid=' + e.currentTarget.dataset.skuid
            })
          } else {
            wx.navigateTo({
              url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodid + '&skuid=' + e.currentTarget.dataset.skuid + '&isFree=' + '37'
            })
          }
        }
      }else{
        this.VerificationCode()
      }
    },
  }
})
