// page/yueMember//pages/NethongVilla/NethongVilla.js
import {
  get,
  post,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  detail:function(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + this.data.goodsInfo.goodsId + '&skuid=' + this.data.goodsInfo.skuId
    })
  },
  NethongVillaDetail:function(){
    wx.navigateTo({
      url: '/page/yueMember/pages/NethongVillaDetail/NethongVillaDetail',
    })
  },
  initData:function(){
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    post('/app/mall/hotelActivity', {
      uid:wx.getStorageSync('uid')
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          img:res.data.data.img,
          goodsInfo: res.data.data.goodsInfo,
          state: res.data.data.state
        })
        wx.hideLoading()

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.initData()
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

  }
})