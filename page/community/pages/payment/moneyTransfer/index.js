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
    // 金额输入字段
    moneyValue:'',
    // 提示最大金额字段
    maxMoney:'100',
    // 自动获取焦点
    moneyFocus:false,
    // 余额
    balanceMoney:'',
    // 弹窗显示
    alertShow:false,
    // 弹窗展示顺序
    comIndex:0,
    // 电话
    phone:'',
    // 佣金金额
    bonusMoney:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      balanceMoney: options.balanceMoney,
      phone: options.phone,
      bonusMoney: options.bonusMoney
    })
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
  // 金额输入事件
  moneyInput(e){
    if (e.detail.value==''){
      this.setData({
        moneyFocus: false
      })
    }
    this.setData({
      moneyValue: e.detail.value
    })
  },
  // 点击金额输入钱的遮罩层事件
  getFocus(){
    this.setData({
      moneyFocus: true
    })
  },
  // 点击全部事件
  setMoney(){
    this.setData({
      moneyFocus:true,
      moneyValue: this.data.bonusMoney
    })
  },
  // 关闭弹窗事件
  closeAlert() {
    this.setData({
      alertShow: false
    })
  },
  // 子组件点击下一步事件
  nextAlert(e) {
    console.log(e.detail)
    this.setData({
      comIndex: e.detail
    })
    if(e.detail==0){
      // 调用子级的倒计时
      this.selectComponent('#myCode').countdownFun()
    }
  },
  // 佣金转入事件
  intoMoney(){
    if (this.data.moneyValue == '' || this.data.moneyValue=='0'){
      wx.showToast({
        title: '转入金额必须大于0',
        icon: 'none'
      })
      return
    }
    if (this.data.moneyValue > this.data.bonusMoney ){
      wx.showToast({
        title: '可用佣金不足',
        icon: 'none'
      })
      return
    }
    this.setData({
      alertShow:true,
      comIndex:2
    })
  },
  // 开始转入
  intoStart(e){
    post('/app/member/balance/overToBalance', {
      "money": this.data.moneyValue,  //金额
      "word": e.detail //密码
    },(res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        this.setData({
          alertShow:false
        },()=>{
          wx.navigateBack({
            delta: 1
          })
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'),1,'aes')
  }
})