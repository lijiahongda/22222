// page/Yuemall/pages/IntegralMall/IntegralMall.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    type:'',
    pageSize:10,
    page:1,
    title:'',
    num:0,
    todayAdd:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options, 'option')
    let title = ''
    if (options.type==0){
      wx.setNavigationBarTitle({
        title: '历史累计悦豆',
      })
      title="今日新增"
    } else if (options.type==3){
      wx.setNavigationBarTitle({
        title: '即将到期悦豆',
      })
      title = "立即使用"
    } else if (options.type == 2) {
      wx.setNavigationBarTitle({
        title: '消耗悦豆',
      })
      title = "已使用悦豆"
    }

    that.setData({
      type: options.type,
      title: title,
      num:options.num
    })
    that.getList()

  },
  goBack:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  // 悦豆说明
  tips:function(){
    wx.navigateTo({
      url: '/page/CardVolume/pages/Explain/Explain'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;

  },
  // 商品列表  
  getList: function() {
    let that = this
    post('/app/member/getIntegralList', {
      type: that.data.type,
      page:1,
      pageSize: that.data.pageSize,
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          list: res.data.list
        })
        if(that.data.type==0){
          that.setData({
            todayAdd: res.data.todayAdd
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    that.data.page+=1
    wx.showLoading()
    post('/app/member/getIntegralList', {
      type: that.data.type,
      page: that.data.page,
      pageSize: that.data.pageSize,
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        wx.hideLoading()
        if (res.data.list.length){
          that.setData({
            list: that.data.list.concat(res.data.list)
          })
        }else{
          wx.showToast({
            title: '暂无更多',
            icon:'none'
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1);
  }
})