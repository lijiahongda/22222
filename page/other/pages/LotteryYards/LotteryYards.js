import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    statusImg: {
      winning: '/images/assistantFriends/winning.png',
      notWinning: '/images/assistantFriends/notWinning.png',
      expired: '/images/assistantFriends/expired.png',
      notUse: '/images/assistantFriends/notUse.png',
    },
    pages:1,
    list: []
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的' + options.title + '消费码'
    })
    this.setData({
      title:options.title,
      status: options.status
    })
    this.getList()  //列表
  },
  onShow: function () {

  },
  getList: function () {
    var that = this
    let url = ''
    if (that.data.status == 1 || that.data.status == 2){ //抽奖码分类 天天和周周
      url = '/app/member/prize/getMyConsumerCode?page=1&type=' + that.data.currentTab + '&status=' + that.data.status
    }
    else { // 否则全部抽奖码
      url = '/app/member/prize/getMyConsumerCode?page=1&type=' + that.data.currentTab
    }
    get(url, {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          // listCont: res.data.data,
          list: res.data.data.item,
        })
        wx.hideLoading()
      } else {

      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    }
    else {
      this.setData({
        currentTab: cur
      })
    }
    this.getList()  //列表
  },

  // 复制
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
      },
      complete(res) {
      }
    })
  },
  onPullDownRefresh: function () {//下拉刷新
    wx.stopPullDownRefresh();
  },
  /**
* 页面上拉触底事件的处理函数
*/
  onReachBottom: function () {
    let that = this;
    wx.showLoading();
    that.data.pages += 1
   

    get('/app/member/prize/getMyConsumerCode?page='+that.data.pages+'&type=' + that.data.currentTab, {}, (res) => {
      if (res.data.code == 200) {
        if (res.data.data.length > 0) {
          that.setData({
            list: that.data.list.concat(res.data.data.item),
          })
          wx.hideLoading();
        }
        else {
          wx.showToast({
            title: '没有更多了！',
            icon: 'none'
          })
        }
      } else {

      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));

  },
})