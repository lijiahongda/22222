// page/yueMember//pages/VideoPayResults/VideoPayResults.js
import {
  get,
  post,
  relations
} from '../../../../utils/util.js';
Page({

  /**pos
   * 页面的初始数据
   */
  data: {

  },
  home: function () {
    wx.navigateBack({
      delta: 2
    })
  },
  initData: function (projectId) {
    let that = this
    post('/vcard/videoRecommend', {
      projectId: projectId
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          list: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0)
  },
  VideoRechargeDetail: function (e) {
    wx.navigateTo({
      url: '/page/yueMember/pages/VideoRechargeDetail/VideoRechargeDetail?projectid=' + e.currentTarget.dataset.projectid
    })
  },
  lookOrder:function(){
    wx.navigateTo({
      url: '/page/oneself/pages/videoList/videoList'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      type: options.type
    })
    that.initData(options.pid)
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