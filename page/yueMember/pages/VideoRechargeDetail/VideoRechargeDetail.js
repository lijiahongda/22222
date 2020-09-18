// page/yueMember//pages/VideoRechargeDetail/VideoRechargeDetail.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:''
  },
  mobile:function(e){
    this.setData({
      mobile:e.detail.value
    })
  },
  Denomination:function(e){
    let that = this
    let { active, index, price, province, pid, officialprice} = e.currentTarget.dataset
    for (var i = 0; i < that.data.list.length;i++){
      if(i != index){
        that.data.list[i].active = false
      }else{
        that.data.list[i].active = true
      }
    }
    that.data.list[0].Denomination = false
    that.setData({
      list: that.data.list,
      price: price,
      province: province,
      pid: pid,
      officialprice: officialprice
    })
  },
  initData: function (projectId) {
    let that = this
    post('/vcard/newCardInfo', {
      projectId: projectId
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        for (let l=0; l< res.data.data.list.length;l++){
          if (l == 0){
            res.data.data.list[l].Denomination = true
          }
          res.data.data.list[l].active = false
          res.data.data.list[l].province = (res.data.data.list[l].official_price - res.data.data.list[l].sale_price).toFixed(2)
        }
        that.setData({
          goods_info: res.data.data.goods_info,
          list: res.data.data.list,
          province: res.data.data.list[0].province,
          price: res.data.data.list[0].sale_price,
          pid: res.data.data.list[0].p_id,
          officialprice: res.data.data.list[0].official_price,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  lookOrder:function(){
    wx.navigateTo({
      url: '/page/oneself/pages/videoList/videoList',
    })
  },
  join:function(){
    wx.switchTab({
      url: '/page/EliteCard/EliteCard'
    })
  },
  pay:function(){
    let that = this
    if(that.data.mobile == ''){
      wx.showToast({
        title: '请输入充值手机号',
        icon:'none'
      })
      return false
    }
    wx.showToast({
      title: '支付中',
      icon:'none'
    })
    post('/vcard/vCardPay', {
      p_id: that.data.pid,
      mobile: that.data.mobile,
      p_type:3
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.pay.getwayBody.timeStamp,
          'nonceStr': res.data.pay.getwayBody.nonceStr,
          'package': res.data.pay.getwayBody.package,
          'signType': 'MD5',
          'paySign': res.data.pay.getwayBody.paySign,
          'success': function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '支付成功',
              icon: 'none'
            })
            wx.navigateTo({
              url: '/page/yueMember/pages/VideoPayResults/VideoPayResults?type='+1+'&pid='+that.data.pid
            })
          },
          'fail': function (res) {
            wx.hideLoading()
            wx.navigateTo({
              url: '/page/yueMember/pages/VideoPayResults/VideoPayResults?type=' + 2 + '&pid=' + that.data.pid
            })
          },
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.initData(options.projectid)
    that.setData({
      cardType: wx.getStorageSync('cardType')
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

  }
})