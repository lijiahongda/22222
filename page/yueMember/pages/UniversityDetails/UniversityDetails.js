// page/yueMember/pages/UniversityDetails/UniversityDetails.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js'
import WxParse from "../../../../wxParse/wxParse/wxParse.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WebViewUrl:'https://www.yuelvhui.com/marketing/yuelvdaxue/index.html?id='
  },
  bindload:function(e){
    console.log(e.detail)
  },
  binderror:function(e){
    console.log(e.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that = this
    console.log(options)
    console.log(that.data.WebViewUrl)
   that.setData({
     WebViewUrl: that.data.WebViewUrl+options.id
   })
    console.log(that.data.WebViewUrl)

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

  }
})