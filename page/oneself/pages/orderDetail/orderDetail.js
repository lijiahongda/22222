// page/My/pages/orderDetail/orderDetail.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderProcess: [],
    ordersn:'',
    list:[]
  },
  // 复制
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
      },
      complete(res) {
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      
      ordersn: options.ordersn
    })
    this.getList()
  },
  // 列表
  getList:function(){
    let that = this
    post('/hd/orderDetail', {
      ordersn: that.data.ordersn,
      fromType: 2
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res,'----')
        that.setData({
          list: res.data.data,
          orderProcess: res.data.data.assembleState,
          orderProcessLength: (res.data.data.assembleState.length - 1),
          isShow: res.data.data.isShow,
          shippingStatus: res.data.data.shippingStatus,
          orderThreePartner: res.data.data.orderThreePartner,
          logisticeInfo: res.data.data.logisticeInfo.orderTrack,
          orderType: res.data.data.orderType,
          memberInfo:res.data.data.memberInfo
        })

      } else {

      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})