// page/yueMember//pages/UniversityList/UniversityList.js
import {
  get,
  post,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    pageSize:10,
    isHaveMore:true
  },
  Detail: function(e) {
    wx.navigateTo({
      url: '/page/yueMember/pages/UniversityDetails/UniversityDetails?id=' + e.currentTarget.dataset.id
    })
  },
  list: function(id) {
    let that = this
    get('/university/v2/list/' + id + '/' + that.data.pageSize + '/' + that.data.page, {}, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          list: res.data.data.list,
          page: that.data.page + 1
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.list(options.id)
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
  onReachBottom: function () {
    let that = this
    if (this.data.isHaveMore) {
      get('/university/v2/list/' + that.data.type + '/' + that.data.pageSize + '/' + that.data.page, {}, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data.list),
            page: res.data.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.list.length > 0 ? true : false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  }
})