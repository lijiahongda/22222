// page/Yuemall//pages/LevelPages/LevelPages.js
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
  goToInfo(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodid + '&skuid=' + e.currentTarget.dataset.skuid + '&isFree=' + '37'
    })
  },
  initData: function (id, channelId) {
    let that = this
    post('/mall/V2/getCategory', {
      categoryFirstId:id,
      channelId: channelId
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          brandlist: res.data.data.brand.list,
          categorylist: res.data.data.category.list,
          banner:res.data.data.banner,
          list: res.data.data.goodsInfo
        })
        wx.hideLoading()
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'),4)
  },
  LevelList:function(e){
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/page/Yuemall/pages/LevelList/LevelList?id=' + e.currentTarget.dataset.id + '&aid=' + e.currentTarget.dataset.aid + '&title=' + e.currentTarget.dataset.name + '&channelId=' + this.data.channelId+'&type='+type
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      channelId: options.channelId
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    that.initData(options.id, options.channelId)
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
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
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