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
    type:1, // 1-直推群；2-间推群
    data:{}, 
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token')
    })
  },
  onShow(){
    this.getData()
  },

  changeType(e) {
    this.setData({
      type: e.currentTarget.dataset.type,
      page:1,
      list:[]
    })
    this.getData()
  },

  getData() {
    let that = this,
      data = {
        type: this.data.type,  //列表类型 1直推群 2间推群
        page: this.data.page, //页数
        pageSize: 10, //一页展示数
        mid: this.data.uid,
        source: 1,
      }
    post('/api/community/groupRule/groupList', data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          data: res.data.data,
          list: res.data.data.list
        })
      }
    }, 1, this.data.token, true, this.data.uid, 8)
  },

  // 升级群
  upLv(e) {
    let that = this,
      data = {
        groupId: e.currentTarget.dataset.groupid,
        mid: this.data.uid
      }
    post('/api/community/groupRule/applyReviewV2', data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          page: 1,
          list: []
        })
        that.getData()
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, this.data.token, true, this.data.uid, 8)
  },

  goGroupUp() {
    wx.navigateTo({
      url: '/page/community/pages/groupUp/groupUp?status=2',
    })
  },

  goOpen(e){
    wx.navigateTo({
      url: '/page/community/pages/openAssistant/openAssistant?groupId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page+1,
    })
    this.getData()
  }
})