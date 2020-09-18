// page/Mall/pages/GroupList/GroupList.js
import {
  get,
  post,
  wxLogin
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 去拼单详情
  GoGroupDetail:function(e){
    wx.navigateTo({
      url: '/page/Yuemall/pages/GroupDetail/GroupDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 倒计时
  startTimer: function (totalSecond, v) {
    let that = this
    // 倒计时
    var totalSecond = totalSecond;
    // totalSecond = that.data.statrstime
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      // console.log(this.data.groupInfo)
      this.data.list[v].countDownHour = hrStr;
      this.data.list[v].countDownMinute = minStr;
      this.data.list[v].countDownSecond = secStr;
      this.setData({
        list: this.data.list
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.data.list[v].countDownHour = '00';
        this.data.list[v].countDownMinute = '00';
        this.data.list[v].countDownSecond = '00';
      }
    }.bind(this), 1000);
  },
  dataList:function(){
    let that = this
    get('/hd/teamGroupLists?id='+ that.data.team_id +'&uid='+that.data.uid, {}, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        console.log(res)
        let data = res.data.data
        that.setData({
          list:data
        })
        for (var v = 0; v < data.length; v++) {
          console.log(data[v].countDown)
          that.startTimer(data[v].countDown, v)
        }
        
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that = this
   that.setData({
     uid: wx.getStorageSync('uid'),
     team_id: options.team_id
   })
    that.dataList()
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

  }
})