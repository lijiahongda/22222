// page/oneself/pages/SalesSettlement/SalesSettlement.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  ProcurementSettlement: function () {
    wx.navigateTo({
      url: '/page/yueMember/pages/personalStoresList/personalStoresList?time=' + 'total' + '&name=' + '采购结算',
    })
  },
  Datainit: function () {
    var that = this
    post('/app/member/saleMoney', {}, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data.allType,
          total: res.data.data.total
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Datainit()
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