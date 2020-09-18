// page/yueMember//pages/VideoRechargeDetail/VideoRechargeDetail.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:[],
    current:0,
    list: [],
    list1:[],
    icon:'https://image.yuelvhui.com/pubfile/2019/11/20/line_1574232843_46206.png'
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.orderList()
  },

  onShow: function () {
  },
  nav:function(e){
    console.log(e)
    this.setData({
      current: e.currentTarget.dataset.id
    })
  },


  // 列表
  orderList: function (e) {
    let that = this
    wx.showLoading()
    post("/mall/drContent", {}, res => {
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data.content,
          list1: res.data.data.content2,
          icon:res.data.data.icon,
          tab:res.data.data.tab
        })
        wx.hideLoading()
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },



  // 跳转商品详情
  goAdult: function (e) {
    wx.navigateToMiniProgram({
      appId: 'wx3b5c2af451998243'
    })
  }

})

