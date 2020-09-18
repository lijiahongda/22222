// page/yueMember/pages/StandbyCommission/StandbyCommission.js
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
    currentTab:0,
    titleitem:[
      {id:0,name:'日'},
      { id: 1, name: '周' },
      { id: 2, name: '自定义' }
    ]
  },
  // 开始时间
  bindstartdate: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startdate: e.detail.value
    })
    // 自定义
    if (this.data.currentTab == 2) {
      this.getList()
    }
  },
  // 结束时间
  bindenddate: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      enddate: e.detail.value
    })
    // 自定义
    if (this.data.currentTab==2){
      this.getList()
    }
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.currentTarget.dataset.current
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
      this.getList()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  // 列表
  getList:function(){
    let that = this
    let obj={
      page: 1,
      type: that.data.currentTab + 1, //1=> 日 2=> 周 3=> 自定义时间
    }
    // 自定义
    if (that.data.currentTab==2){
      if (that.data.startdate && that.data.enddate) {
        obj.startTime = that.data.startdate
        obj.endTime = that.data.enddate
        if (that.data.startdate >= that.data.enddate){
          wx.showToast({
            title: '结束时间不能早于等于开始时间',
            icon:'none'
          })
          return
        }
      }else{
        return
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    post('/app/member/commission', obj, (res) => {
      console.log(res,'zhelishi neirong')
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          list: res.data.data,
          orderCount: res.data.orderCount, //订单数
          orderSum: res.data.orderSum, //金额
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})