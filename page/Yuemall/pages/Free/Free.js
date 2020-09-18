// page/Yuemall/pages/Free/Free.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCommission: false
  },
  //数据
  orderData: function() {
    let that = this
    post('/mall/member/sendMemberGoodsRule', {
      uid: wx.getStorageSync('uid')
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          rule: res.data.data.rule,
          remind: res.data.data.remind,
          time: res.data.data.time,
          state: res.data.data.state,
          activityId: res.data.data.activityId
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  // 关闭领取佣金
  closeCommission: function() {
    this.setData({
      isCommission: false
    })
  },
  Free: function() {
    if (this.data.state == 0) {
      this.setData({
        isCommission: true
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/NewHotStyle/NewHotStyle?id=' + this.data.activityId,
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      cardType: wx.getStorageSync('cardType')
    })
    that.orderData()
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

  }
})