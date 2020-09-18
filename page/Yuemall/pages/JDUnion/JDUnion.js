import {
  get,
  post
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerData:{}, // banner列表 
    classData:[], // tab列表
    goodsList:[], // 商品列表
    keyWord:'',
    pageNum:1,
  },

  // 首页数据
  getData() {
    let that=this
    post('/outside/jdHomeIndex', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          bannerData: res.data.data.bannerData,
          classData: res.data.data.classData,
          nowTab: res.data.data.classData[0].id
        })
        this.selectTab()
        that.getList()
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, this.data.token, true, this.data.uid, 4)
  },

  // 商品列表
  getList(){
    let that = this,
      data={
        classId: this.data.nowTab,
        page: this.data.pageNum,
        pageSize:10
      }
    post('/outside/jdHomeSearchGoodsList', data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          goodsList: this.data.goodsList.concat(res.data.data)
        })
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, this.data.token, true, this.data.uid, 4)
  },

  // 选中第几个
  selectTab(){
    let classData = this.data.classData
    classData.forEach(item=>{
      item.select=false
      if(item.id==this.data.nowTab){
        item.select = true
      }
    })
    this.setData({
      classData: classData
    })
  },

  // 切换tab
  switchTab(e){
    console.log(e)
    this.setData({
      nowTab: e.currentTarget.dataset.id,
      goodsList:[]
    })
    this.selectTab()
    this.getList()
  },

  // 搜索内容变化
  bindblur(e){
    this.setData({
      keyWord: e.detail.value
    })
  },

  goDetail(e){
    console.log(e)
    wx.navigateTo({
      url: '/page/Yuemall/pages/JDUnionDetail/JDUnionDetail?goods_id=' + e.currentTarget.dataset.goodsid,
    })
  },

  goJD(e){
      wx.navigateToMiniProgram({
        appId: 'wx13e41a437b8a1d2e',
        path: '/pages/proxy/union/union?spreadUrl=' + e.currentTarget.dataset.path +'&customerinfo=hyyhtqyp20200219',
        extraData: {

        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
  },

  goSearch(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/search/search?channelid=100',
    })
  },

  // 分类列表
  classificationList: function (e) {
    wx.setStorageSync('homeShow', false)
    console.log(e, '----')
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        intoView: 'id2'
      })
      return
    }
    app.classificationList(e, this)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token')
    })
    this.getData()
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
    this.setData({
      pageNum: this.data.pageNum+1
    })
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})