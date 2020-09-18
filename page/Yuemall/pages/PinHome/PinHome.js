// page/Yuemall//pages/PinHome/PinHome.js
import {
  get,
  post
} from '../../../../utils/util.js';
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    list: [],
    idx: 0,
    imgs:[],
    page:1,
    pageSize:10
  },
  onTapclier: function (e) {
    console.log(e,'eeee')
    let that = this
    let {
      id,
      index,
      name
    } =e.currentTarget.dataset
      that.setData({
        idx:index,
        fixeid: id,
        page:1,
        keyword:name
      })
    this.getlist(id,1)
  },
  initData(){
    post('/pdd/v1/queryThemeList',{},(res)=>{
      if(res.data.code==200){
        this.setData({
          imgs:res.data.data.doc
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 6)
    post('/pdd/v1/queryGoodsCategoryList', {}, (res) => {
      if (res.data.code == 200) {
        this.setData({
          list: res.data.data
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 6)
  },
  getlist(id,page){
    post('/pdd/v1/queryGoodsList', {
      id: id,
      coupon: 1,
      sort_type: 0,
      page: page,
      page_size: 10,
      keyword: ''
    }, (res) => {
      if (res.data.code == 200) {
        for (let i of res.data.data) {
          if (i.info.tk) {
            i.info.tk = i.info.tk.toFixed(2)
          }
        }
        this.setData({
          goodlist: res.data.data
        })
        
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 6)
  },
  search(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/search/search?channelid=98',
    })
  },
  seedetail(e){
    wx.navigateTo({
      url: '/page/Yuemall/pages/pddDetails/details?goodsId='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
    this.getlist(8569,1)
    
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
    let that=this
    
    var  page=that.data.page+1
    console.log(that.data.page,'pagepage')
    post('/pdd/v1/queryGoodsList', {
      id: that.data.fixeid ? that.data.fixeid:'8569',
      coupon: 1,
      sort_type: 0,
      page: page,
      page_size: 10,
      keyword: ''
    }, (res) => {
      if (res.data.code == 200) {
        for (let i of res.data.data) {
          if (i.info.tk) {
            i.info.tk = i.info.tk.toFixed(2)
          }
        }
        this.setData({
          goodlist: that.data.goodlist.concat(res.data.data),
          page:page
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 6)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})