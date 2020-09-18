// page/Yuemall//pages/lookComment/lookComment.js
import {
  get,
  post
} from '../../../../utils/util.js';
var previewOnshow; // 解决图片预览 出发onshow
Page({

  /**
   * 页面的初始数据
   */
  data: {
    three: 3,
    imagenum: 20,
    page:1,
    pageSize:10,
    isHaveMore:true
  },
  // 图片点击事件
  imgYu: function(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    previewOnshow = true; //解决图片预览出发onshow
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  orderDeta:function(id){
    let that = this
    post('/mall/productCommentList', {
      page: that.data.page,
      pageSize: that.data.pageSize,
      product_id: id
    }, (res) => {
      if (res.data.code == 200) {
        wx.hideLoading()
        that.setData({
          list: res.data.data.result,
          page: that.data.page + 1
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options)
    that.setData({
      productid: options.productid
    })
    that.orderDeta(options.productid)
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

  onReachBottom: function () {
    let that = this
    if (this.data.isHaveMore) {
      post(that.data.url, {
        page: that.data.page,
        pageSize: that.data.pageSize,
        product_id: that.data.productid
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data.result),
            page: res.data.data.result.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.result.length > 0 ? true : false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }

  }
})