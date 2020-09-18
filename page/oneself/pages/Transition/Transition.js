// page/oneself/pages/Transition/Transition.js
import {
  get,
  post,
  relations,
  retrunScene,
  wxLogin
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  image:function(){
    wx.switchTab({
      url: '/page/personalCenter/personalCenter',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I);//缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    wxLogin();
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