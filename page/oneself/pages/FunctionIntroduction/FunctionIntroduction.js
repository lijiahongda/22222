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
    image:''
  },
  // image: function () {
  //   wx.switchTab({
  //     url: '/page/personalCenter/personalCenter',
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that = this
   let image = ''
   let title = ''
   let color = ''
    if (options.type == 2){
      image = 'https://image.yuelvhui.com/pubfile/2019/05/31/line_1559309456.jpg'
      title = '自买省钱'
    } else if (options.type == 3) {
      image = 'https://image.yuelvhui.com/pubfile/2019/05/31/line_1559309538.jpg'
      title = '推广商品'
      color = '#F7523D'
    } else if (options.type == 4) {
      image = 'https://image.yuelvhui.com/pubfile/2019/05/31/line_1559297443.png'
      title = '合伙人'
      color = '#F85821',
      that.setData({
        MyreCode: options.MyreCode
      })
    }
    wx.setNavigationBarTitle({
      title: title
    })
    that.setData({
      image: image,
      color:color,
      type: options.type
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
    wx.setStorageSync('myrequest', '');

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