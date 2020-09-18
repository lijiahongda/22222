// page/Yuemall/pages/Allarticle/Allarticle.js
import {
  get,
  post,
  wxLogin,
  relations,
  retrunScene,
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisplayFulltext: false,
    page:1,
    pageSize:10,
    isHaveMore:true
  },
  DisplayFulltext: function() {
    console.log('====')
    this.setData({
      isDisplayFulltext: this.data.isDisplayFulltext ? false : true
    })
  },
  initData: function (goodsId){
    let that = this
    post('/mall/V2/goodsArticle', {
      goodsId:goodsId, 
      page:that.data.page,
      pageSize:that.data.pageSize
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
       that.setData({
         articleInfo:res.data.data,
         page:that.data.page+1
       })
      }
    }, 1, wx.getStorageSync('token'), true,wx.getStorageSync('uid'),4);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that =this;
    that.setData({
      goodsId: options.goodsId
    })
    that.initData(options.goodsId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  onReachBottom: function () {
    let that = this
    if (this.data.isHaveMore) {
      post('/mall/V2/goodsArticle', {
      goodsId:that.data.goodsId, 
      page:that.data.page,
      pageSize:that.data.pageSize
    },(res) => {
        if (res.data.code == 200) {
          that.setData({
            articleInfo: that.data.articleInfo.concat(res.data.data),
            page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.length > 0 ? true : false
          })
        } else {

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