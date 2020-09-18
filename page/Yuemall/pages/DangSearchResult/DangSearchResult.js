// page/Yuemall//pages/Dangtuijian/Dangtuijian.js
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
    page: 1,
    pageSize: 10,
    LoadingStatus: false,
    name:'',
    isHaveMore:true
  },
  initData: function (options) {
    let that = this
    that.setData({
      LoadingStatus: true,
      name:options.name
    })
    post('/mall/dd/getDdSearchKeyWord', {
      sorttype: 1,
      sort: 0,
      channelId: 8,
      keyword: options.name,
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
  detailbook: function (e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/DangBookDetail/DangBookDetail?goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.initData(options)
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.name
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
    let that = this
    if (this.data.isHaveMore) {
      post('/mall/dd/getDdSearchKeyWord', {
        sorttype: 1,
        sort: 0,
        channelId: 8,
        keyword: that.data.name,
        page: that.data.page,
        pageSize: that.data.pageSize
      }, (res) => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data),
            page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  }
})