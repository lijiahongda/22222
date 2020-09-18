// page/oneself/pages/CommissionsDescription/CommissionsDescription.js
import {
  get,
  post,
  wxLogin
} from '../../../../utils/util.js';
import WxParse from "../../../../wxParse/wxParse/wxParse.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that = this;
    get('/app/bonus/bonusDocument?type='+'xiaochengxu', {}, (res) => {
 
      if (res.data.code == 200) {
        setTimeout(function(){
          WxParse.wxParse('article', 'html', res.data.document, that, 5);
        },500)
        
      } else { }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
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

})