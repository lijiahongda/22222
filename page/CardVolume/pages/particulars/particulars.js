import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    page: 1,
    uid:'',
    token:'',
    isHaveMore:true,
    type:0,
    currentTab: 0, //预设当前项的值,
  },
  // 去使用
  ToUse:function(){
    wx.switchTab({
      url: '/page/Mall/YueMall',
    })
  },
  // 悦豆说明
  Explain:function(){
    wx.navigateTo({
      url: '/page/CardVolume/pages/Explain/Explain',
    })
  },
  // 标签切换
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
    if (this.data.currentTab == 0) {
      this.setData({
        type: 0,
        page: 1
      })
      this.getOrderList()
    } else if (this.data.currentTab == 1) {
      this.setData({
        type: 1,
        page: 1
      })
      this.getOrderList()

    } else if (this.data.currentTab == 2) {
      this.setData({
        type: 2,
        page: 1
      })
      this.getOrderList()

    } else if (this.data.currentTab == 3) {
      this.setData({
        type: 3,
        page: 1
      })
      this.getOrderList()
    }
  },
  // 关闭提示
  close:function(){
    let that = this
    that.setData({
      flag:0
    })
  },
  // 列表数据
  getOrderList: function () {
    var that = this;
    get('/app/member/integralList/' + that.data.page +'/'+that.data.type, {}, (res) => {
    
      if (res.data.code == 200) {
        that.setData({
          flag: res.data.tips.flag,
          available: res.data.available,
          todayTotal: res.data.todayTotal,
          hisTotal: res.data.hisTotal,
          consume: res.data.consume,
          expire: res.data.expire,
          tips: res.data.tips,
          list: res.data.list,
          total: res.data.total,
          page: that.data.page + 1
        })
      } else { }
    }, 1, that.data.token, true, that.data.uid)
  },
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })
    this.getOrderList();
  },
  onPullDownRefresh: function () {
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  onShow:function(){
    wx.setStorageSync('myrequest', '');

  },
  /**
* 页面上拉触底事件的处理函数
*/
  onReachBottom: function () {
    var that = this
    if (that.data.isHaveMore) {
      get('/app/member/integralList/' + that.data.page + '/' + that.data.type, {}, (res) => {
        if (res.data.code == 200) {
          let orderData = that.data.list;
          that.setData({
            list: that.data.list.concat(res.data.list),
            page: res.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.list.length > 0 ? true : false
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '网络错误 ',
            icon: 'none',
            duration: 1000
          })
        }
      }, 1, that.data.token, true, that.data.uid)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  },
})