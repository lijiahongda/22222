import { get, post } from '../../../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    token: '',
    noMember: false,
    areaId:0,
    give:0, // give:  0：未发放, 1：已发放, 2：等待发放
    bgImg:'',
    qrcode: '/images/touristCard/qrcode.png',
    timer: null,
    noMemberImg: '',//非会员背景图
  },
  
  onLoad: function (options) {
    let that = this
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })
    get('/app/member/v3/card/list', {}, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        that.setData({
          list:res.data.data,
          type:res.data.type,
          give:res.data.give,
          qrcode: res.data.qrcode,
          bgImg: res.data.bgImage,
          noMemberImg: res.data.noticeImage
        })
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
       }
    }, 1, that.data.token, true, that.data.uid)
  },
  gotoReceive(){ //立即领取
    let that = this;
    if(wx.getStorageSync('cardType') == 0){
      // wx.getStorageSync('cardType') == 0 的 时候  不是 会员 否则都是会员
      that.setData({
        noMember:true 
      })
    }
    else{
      get('/app/card/right/travelV2/2',{},
      (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          that.setData({
            give:res.data.give
          })
          wx.navigateTo({
            url: '/page/CardVolume/pages/promptMessage/promptMessage',
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 1, that.data.token, true, that.data.uid)
      that.setData({
        noMember:false
      })
    }
  },
  gotoReceiveInfo(){ // 查看详情
    wx.navigateTo({
      url: '/page/CardVolume/pages/cardDetails/cardDetails'
    })
  },
  refused(){ // 残忍拒绝
    let that = this;
    that.setData({
      noMember:false
    })
  },
  accept(){ // 升级年卡
    let that  =this
    that.setData({
      noMember:false
    })
    that.data.timer = setTimeout(()=>{
      wx.switchTab({
        url: '/page/EliteCard/EliteCard',
      })
      that.data.timer = null
    },1)
  },
  colseNomember(){//关闭领取年卡
    let that = this;
    that.setData({
      noMember:false
    })
  },
  onShow: function () {
    wx.setStorageSync('myrequest', '')
  }
})