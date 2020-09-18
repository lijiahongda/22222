// page/Mall/pages/HaggleList/HaggleList.js
import {
  get,
  post,
  wxLogin
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  dataList: function () {
    let that = this
    wx.showLoading()
    get('/hd/getBargainFoundMemberList?id=' + that.data.id +'&type='+that.data.type, {}, (res) => {
      if (res.data.code == 200) {
        let data = res.data.data
        that.setData({
          list: data
        })
        setTimeout(function(){
          wx.hideLoading()
        },1500)
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    let that = this;
    that.setData({
      id:options.id,
      type:options.type
    })
    that.dataList()
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