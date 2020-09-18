// page/yueMember//pages/personalStoresList/personalStoresList.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    isHaveMore: true,
    istoday: false,
    isyestoday: false,
    ismonth: false,
    istotle: false
  },
  screen: function(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let time = 1
    wx.showLoading({
      title: '加载中',
    })
    if (type == 'today') {
      that.setData({
        istoday: that.data.istoday ? false : true,
        isyestoday: false,
        ismonth: false,
        istotle: false
      })
      time = 1
    } else if (type == 'yestoday') {
      that.setData({
        isyestoday: that.data.isyestoday ? false : true,
        istoday: false,
        ismonth: false,
        istotle: false
      })
      time = 2

    } else if (type == 'month') {
      that.setData({
        ismonth: that.data.ismonth ? false : true,
        isyestoday: false,
        istoday: false,
        istotle: false
      })
      time = 3

    } else if (type == 'totle') {
      that.setData({
        istotle: that.data.istotle ? false : true,
        ismonth: false,
        isyestoday: false,
        istoday: false
      })
      time = 4

    }
    that.initData(that.data.type, time)
    that.setData({
      time: time
    })
  },
  initData: function(type, time) {
    let that = this
    that.setData({
      page: 1
    })
    post('/app/member/bonus/order/list', {
      type: type,
      time: time,
      page: that.data.page
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          page: that.data.page + 1,
          list: res.data.data.list
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    let type = 1
    let time = 1
    wx.setNavigationBarTitle({
      title: options.name
    })
    if (options.type == 'left') {
      type = 1
    } else {
      type = 4
    }
    if (options.time == 'today') {
      time = 1
      that.setData({
        istoday: true
      })
    } else if (options.time == 'yestoday') {
      time = 2
      that.setData({
        isyestoday: true
      })
    } else if (options.time == 'month') {
      time = 3
      that.setData({
        ismonth: true
      })
    } else if (options.time == 'total') {
      time = 4
      that.setData({
        istotle: true
      })
    }
    that.setData({
      type: type,
      time: time,
      isHaveMore: true
    })
    that.initData(type, time)
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
    if (this.data.isHaveMore) {
      post('/app/member/bonus/order/list', {
        type: type,
        time: time,
        page: that.data.page
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data.list),
            page: res.data.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.list.length > 0 ? true : false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
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