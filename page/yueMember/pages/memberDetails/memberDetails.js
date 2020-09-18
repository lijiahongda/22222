import { get, post } from '../../../../utils/util.js';
var purchase = true;
var loggingStatus =true;
var rechargeNum = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    orderon:'',
    orderNumber:'',
    addTime:'',
    statusDesc:'',
    title:'',
    buyNumber:'',
    price:'',
    contacts:'',
    tel:'',
    price:'',
    status:'',
    uid:'',
    token:''
  },
  gopay: function (e) {
    var that = this
    post('/app/card/payParams/', {
      orderNo:that.data.orderon
    }, (res) => {
      if (res.data.code == 200) {
        wx.requestPayment({
          'timeStamp': res.data.pay.getwayBody.timeStamp,
          'nonceStr': res.data.pay.getwayBody.nonceStr,
          'package': res.data.pay.getwayBody.package,
          'signType': 'MD5',
          'paySign': res.data.pay.getwayBody.paySign,
          'success': function (res) {
            
          },
          'fail': function (res) {
          },
          'complete':function(res){
          }
        })
      } else { }
    }, 1, that.data.token, true, that.data.uid)
  },
  //获取页面内容
  getOrderList: function () {
    var that = this;
    post('/app/member/orderDetail', {
      "orderNo": this.data.orderon
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          orderNumber: res.data.orderNo,
          addTime: res.data.addTime,
          statusDesc: res.data.statusDesc,
          title: res.data.title,
          buyNumber: res.data.buyNumber,
          price: res.data.price,
          contacts: res.data.contacts,
          tel: res.data.tel,
          price: res.data.price,
          status: res.data.status
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  onLoad: function (options) {
    this.setData({
      orderon: options. orderno,
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })
    this.getOrderList();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onShow:function(){
  }
})