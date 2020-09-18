import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{} // 总数据
  },

  getData(){
    let that=this,
      data={
        type: 4,
        postType: 1,
        uid: wx.getStorageSync('uid')
      }
    post('/outside/shareJumpUrl', data, (res) => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        that.setData({
          data: res.data.data
        })
      } else {

      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 前往第三方
  goThree(){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})