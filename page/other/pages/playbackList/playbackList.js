// page/other/pages/playbackList/playbackList.js
var app = getApp();
import {
  get,
  post,
  wxLogin,
  retrunScene,
  relations,
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start:1,
    limit:10
  },
  initData(roomId){
    let that = this
    get('/app/LiveVideo/anchorPlayback?room_id=' + roomId + '&start=' + that.data.start + '&limit=' + that.data.limit, {}, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading()
        that.setData({
          listdata: res.data.data.data.live_replay
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 3);
  },
  playbackDetail:function(e){
    wx.navigateTo({
      url: '/page/other/pages/playbackDetail/playbackDetail?palyURL=' + e.currentTarget.dataset.url
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.initData(options.roomId)
    that.setData({
      roomImg: options.roomImg,
      roomId: options.roomId,
      title: options.title
    })
    console.log(options.roomImg)
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