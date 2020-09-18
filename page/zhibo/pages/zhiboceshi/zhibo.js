// page/zhiboceshi/zhibo.js
import {
  get,
  post
} from '../../../../utils/util.js';
let livePlayer = requirePlugin('live-player-plugin') // 引入获取直播状态接口
// setInterval(() => {
//   const roomId = xxx // 房间id
//   livePlayer.getLiveStatus({
//       room_id: roomId
//     })
//     .then(res => {
//       // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常 
//       const liveStatus = res.liveStatus
//     })
//     .catch(err => {
//       console.log(err)
//     })
// }, 60000)

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  navigator:function(e){
    wx.navigateTo({
      url: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + e.currentTarget.dataset.roomid + '&reCode=' + wx.getStorageSync('selfReCode')
    })
  },
 
  initData: function(e) {
    let that = this
    get('/demo/live', {}, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          roomid: res.data.data.data
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 3);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData()
    console.log(options,'----')
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log('-----===')

  }
})