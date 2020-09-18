import {
  get,
  post,
} from '../../../../utils/util.js';
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
    this.getList()
    wx.showLoading()
  },
  getList:function(){
    var that = this
    get('/app/member/prize/consumer', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data
        })
        wx.hideLoading()
      } else {

      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },

  LuckyDraw(e){ //参与抽奖
    let that = this;
    wx.navigateTo({
      url:'/page/other/pages/LuckyDrawType/LuckyDrawType?type='+e.currentTarget.dataset.type +'&text='+e.currentTarget.dataset.text
    })
  },
  goToLuckProcess(e) { //查看流程
    let that = this;
    wx.navigateTo({
      url: '/page/other/pages/RuleDescription/RuleDescription'
    })
  },
  clickBanner(){ // banner点击] 暂无事件

  },
  luckProcess(){ // 参与流程

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

  }
})