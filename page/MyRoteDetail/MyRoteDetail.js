// page/MyRoteDetail/MyRoteDetail.js
import {
  get,
  post
} from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    module: 1,
    nav: [true,false,false,false],
    tab: [true,false],
    navStatus: [4,1,2,3],
    tabStatus: [],
    navidx: 0,
    tabidx: 0,
    page: 1,
    list: [],
    totalPage: 0,
    money: 0
  },

  changeNav(e) {
    var idx = e.currentTarget.dataset.idx;
    let mkArr = []
    this.data.nav.forEach((item,index) => {
      idx == index ? mkArr.push(true) : mkArr.push(false)
    })
    this.setData({
      nav: mkArr,
      navidx: idx,
      page: 1,
      list: [],
      totalPage: 0
    })
    if(this.data.tab[0]){
      this.getList()
    }else{
      this.getHad()
    }
  },

  changeTab(e) {
    var idx = e.currentTarget.dataset.idx;
    let mkArr = []
    this.data.tab.forEach((item,index) => {
      idx == index ? mkArr.push(true) : mkArr.push(false)
    })
    this.setData({
      tab: mkArr,
      tabidx: idx,
      page: 1,
      list: [],
      totalPage: 0
    })
    if(idx == 0){
      this.getList()
    }else{
      this.getHad()
    }
  },

  getList(){
    post('/app/member/bonus/order/listv1', {
      time: this.data.navStatus[this.data.navidx],
      page: this.data.page,
      module: this.data.module,
      type: 4
    }, (res) => {
        var totalPage = res.data.data.totalPage;
        var money = res.data.data.totalMoney;
        var list = this.data.list.concat(res.data.data.list);
        this.setData({
          totalPage,
          list,
          money
        })
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },

  getHad(){
    post('/app/member/getBonusSettlement', {
      time: this.data.navStatus[this.data.navidx],
      page: this.data.page,
      module: this.data.module,
      type: 4
    }, (res) => {
        var totalPage = res.data.data.totalPage;
        var money = res.data.data.SettlementMoney;
        var list = this.data.list.concat(res.data.data.list);
        this.setData({
          totalPage,
          list,
          money
        })
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      module: options.id || 1
    })
    this.getList()
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
    if(this.data.tab[0] && this.data.page < this.data.totalPage){
      this.data.page++
      this.getList()
    }
    if(this.data.tab[1] && this.data.page < this.data.totalPage){
      this.data.page++
      this.getHad()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})