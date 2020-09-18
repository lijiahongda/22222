// page/yueMember//pages/University/University.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:null,
  },
  // 分类列表
  classificationList: function (e) {
    app.classificationList(e, this)
  },
  initData:function(){
    let that = this
    let url
    console.log(wx.getStorageSync('uid'))
    get('/university/index', {}, res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        that.setData({
          datas: res.data.data.icon,
          banner:res.data.data.banner
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  makeMoney: function (e) {
    if (e.currentTarget.dataset.type == 5) {
      wx.navigateTo({
        url: '/page/other/pages/YueNews/YueNews',
      })
    } else if (e.currentTarget.dataset.type == 6) {
      this.setData({
        url: 'https://image.yuelvhui.com/pubfile/2019/06/03/line_1559544963.png',
        have: '#6C4E35',
        not: '#fff',
        ide: '权益'
      })
    } else {
      wx.navigateTo({
        url: '/page/oneself/pages/FunctionIntroduction/FunctionIntroduction?type=' + e.currentTarget.dataset.type + '&MyreCode=' + wx.getStorageSync('selfReCode')
      })
    }
  },
  University: function (e) {
    if (e.currentTarget.dataset.type == 10004) {
      wx.navigateTo({
        url: '/page/yueMember/pages/MaterialCircle/MaterialCircle?name=' + e.currentTarget.dataset.name
      })
    } else {
      console.log(e.currentTarget.dataset.type)
      wx.navigateTo({
        url: '/page/yueMember/pages/TrainingClass/TrainingClass?type=' + e.currentTarget.dataset.type + '&name=' + e.currentTarget.dataset.name,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})