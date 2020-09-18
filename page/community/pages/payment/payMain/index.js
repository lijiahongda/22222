// page/payment/payMain/index.js
import {
  get,
  post,
  retrunScene,
  relations
} from '../../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LoadingStatus:true,
    // 去支付按钮金额显示
    payPrice:'9.99元',
    // 按钮变色变量
    moneyBtIndex:'1',
    // 修改密码弹窗
    alertShow:false,
    // 弹窗下标
    comIndex:0,
    // 其他金额获取焦点
    otherFocus:false,
    // 其他金额
    otherMoney:'',
    // 账户余额
    balanceMoney:'',
    // 充值金额信息
    moneyRule:'',
    // 协议内容
    textValue:'',
    // 用户信息
    userMsg:"",
    // 佣金金额
    bonusMoney:'',
    // 充值id
    modelId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 获取充值金额
    this.getUserMoney()
    // 获取用户手机号和其他信息
    this.getUserMsg()
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

  },
  // 获取用户信息
  getUserMsg(){
    get('/app/member/v3/newGet/', {}, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
         this.setData({
           userMsg: res.data.data
         })
        if (res.data.data.isNeedWord==1){
          this.updatePassword()
        }
      } 
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  // 获取充值金额接口
  getUserMoney(){
    get('/app/member/balance/getBalanceMoneyData',{}, (res) => {
      if (res.data.code == 200) {
        // this.selectComponent("#ActivityTemplateBot")._onOption(res.data.data)
        console.log(res.data.data)
        this.setData({
          moneyRule: res.data.data.rule,
          modelId: res.data.data.rule[0].id,
          payPrice: res.data.data.rule[0].actualMoney,
          LoadingStatus: false,
          balanceMoney: res.data.data.balanceMoney,
          bonusMoney: res.data.data.bonusMoney,
          moneyBtIndex:'1'
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },
  // 点击选择金额按钮事件
  choseMoney(e){
    var value = e.currentTarget.dataset.value
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    this.setData({
      payPrice: value == 'other'?'':value,
      moneyBtIndex:index,
      modelId:id
    })
    if (this.data.moneyBtIndex=='6'){
      this.setData({
        otherFocus: true,
        // comIndex: 3
      })
      // return
    }
  },
  // 打开交易明细页面方法
  openDetailed(){
    wx.navigateTo({
      url: '/page/community/pages/payment/Detailed/index',
    })
  },
  // 打开佣金转入页面方法
  openMoneyTransfer() {
    wx.navigateTo({
      url: '/page/community/pages/payment/moneyTransfer/index?balanceMoney=' + this.data.balanceMoney + '&phone=' + this.data.userMsg.mobile + '&bonusMoney=' + this.data.bonusMoney,
    })
  },
  // 点击修改密码
  updatePassword(){
    this.setData({
      alertShow:true,
      comIndex:0
    })
    // 调用子级的倒计时
    this.selectComponent('#myCode').countdownFun()
  },
  // 关闭弹窗事件
  closeAlert(){
    this.setData({
      alertShow:false
    })
  },
  // 子组件点击下一步事件
  nextAlert(e){
    console.log(e.detail)
    this.setData({
      comIndex:e.detail
    })
  },
  // 其他金额输入
  moneyInput(e){
    this.setData({
      payPrice: e.detail.value,
      otherMoney: e.detail.value
    })
  },
  // 输入框移除
  otherInputBlur(){
    this.setData({
      otherFocus:false
    })
  },
  // 打开协议
  openagreement(){
    // 打开协议
    wx.navigateTo({
      url: '/page/community/pages/payment/Recharge/index',
    })
  },
  // 去充值点击事件
  toRecharge(){
    post('/app/member/balance/createChargeOrder', 
      { modelId: this.data.modelId}, (resa) => {
      wx.hideLoading();
        if (resa.data.code == 200) {
          console.log(resa.data.orderNo)
        post('/app/mall/order/payBalanceCharge', {
          "orderNo": resa.data.orderNo,
          "type": 3
        }, (res) => {
          if (res.data.code == 200) {
            wx.requestPayment({
              'timeStamp': res.data.pay.getwayBody.timeStamp,
              'nonceStr': res.data.pay.getwayBody.nonceStr,
              'package': res.data.pay.getwayBody.package,
              'signType': 'MD5',
              'paySign': res.data.pay.getwayBody.paySign,
              'success': (res) =>{
                console.log(res)
                wx.showToast({
                  title: '充值成功',
                  icon: 'none',
                  duration: 2000
                })
                this.onShow()
              },
              'fail': (res) =>{
                wx.showToast({
                  title: '充值失败',
                  icon: 'none',
                  duration: 2000
                })
                this.onShow()
              },
              'complete': function (res) {
                console.log(res)
              }
            })
          } else { }
          }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  }
})