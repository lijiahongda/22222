// page/Yuemall//pages/Dangclassification/Dangclassification.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    LoadingStatus: false,
    page:1,
    pageSize:10
  },
  // 搜索
  search: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/Dangsearch/Dangsearch',
    })
  },
  // 点击进入分类详情
  tabclass:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/page/Yuemall/pages/DangdangList/DangdangList?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name
    })
  },
  getList:function(e){
    let that = this
    that.setData({
      LoadingStatus: true
    })
    post('/mall/dd/getCategory', {
      page: that.data.page,
      pageSize: that.data.pageSize
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res.data)
        that.setData({
          list: res.data.data,
          LoadingStatus: false
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.getList()
    
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

  }
})