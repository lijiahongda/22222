// page/Cloud/index.js
import {
  post,
  get,
  retrunScene,
  relations
} from '../../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adver:{},//广告
    list: [],
    swiperIndex:'',
    page:1
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.getList()
  },
  getList(){
    let that = this
    post('/mall/getBrands', {
      page:1,
      pageSize:20
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          banner: res.data.banner,//banner
          list: res.data.data,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
 
  // banner跳转  商品详情跳转
  classificationList:function(e){
    app.classificationList(e, this)
  },

  // 跳转到品牌列表
  // goBandList:function(e){
  //   wx.navigateTo({
  //     url: '../brandList/brandList?brandId=' + e.currentTarget.dataset.item.brandId + '&type=brand' + '&keyWord=' + e.currentTarget.dataset.item.brandName,
  //   })
  // },
  // 跳转到搜索结果
  goClassInfoList: function (e) {
    let item = e.currentTarget.dataset
    wx.navigateTo({
      url: '../searchResult/searchResult?keyWord=' + item.keyword + '&channelId=' + item.channelid + '&id=' + item.id + '&indexKey=' + item.indexkey + '&xyType=' + item.xytype + '&type=' + item.type + '&brandId=' + item.brandid,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    wx.showLoading()
    that.setData({
      page: that.data.page + 1
    })
    post('/mall/getBrands', {
      page:that.data.page,
      pageSize:20
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        if (res.data.data.length) {
          that.setData({
            list: that.data.list.concat(res.data.data),
          })
        } else {
          wx.showToast({
            title: '没有更多了！',
            icon: 'none'
          })
        }
        wx.hideLoading()
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  }
})