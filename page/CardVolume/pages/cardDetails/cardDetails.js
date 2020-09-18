import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noMember: false,
    cardImageBg:'',//年卡背景图
    noMemberImg: '',//非会员背景图
    mainTitle: '',//年卡标题
    mainTime: '',//年卡有效期
    mainCont: '',//年卡介绍
    mainText: '',//年卡功能
    mainDescOne: '',//立即领取
    subDesc: '',
    uid: '',
    token: '',
    screenHeight: 0,
    bodyTitle: '',
    bodyDesc: '',
    area: [],
    TypeCard: 0,
    areaId: 0,
    buttonBottom: 0,
    end: '',
    activ: [],
    'number':'',
    pwd:''
  },
  // 拒绝
  refused:function(){
    this.setData({
      noMember:false
    })
  },
  // 关闭
  colseNomember:function(){
    this.setData({
      noMember: false
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
  // 立即领取
  ImmediatelyReceive: function(e) {
    let that = this;
    if(wx.getStorageSync('cardType') == 0){
      that.setData({
        noMember:true
      })
    }else{
      get('/app/card/right/travelV2/2',{}, 
      (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          that.setData({
            give:res.data.data.give
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
  orderList: function() {
    let that = this
    get('/app/card/right/travelV2/' + 2, {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          bodyDesc: res.data.data.intro,
          mainTitle: res.data.data.main.title,
          mainDescOne: res.data.data.main.desc,
          subDesc: res.data.data.main.subDesc,
          buttonBottom: 0,
          end: res.data.data.end,
          CollectionTime: res.data.data.time,
          activ: res.data.data.activ,
          use: res.data.data.rules,
          contact: res.data.data.contact,
          tel: res.data.data.tel,
          give: res.data.give,
          number: res.data.number,
          pwd: res.data.pwd,
          cardImageBg: res.data.cardBg,
          noMemberImg: res.data.noticeImage
        })
      } else {
        
      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 电话
  calltel: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel 
    })
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token')
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenHeight: res.screenHeight - 685.5
        })
      },
    })
    that.orderList()
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
  onShow: function() {

  }
})