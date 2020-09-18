// pages/yueMember/CustomTourOrder/CustomTourOrder.js
import {
  post,
  get,
  wxLogin,
  relations
} from '../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    pageSize:10,
    isHaveMore: true    
  },
  CustomTourDetails:function(e){
    wx.navigateTo({
      url: '../CustomTourDetails/CustomTourDetails',
    })
  },
  NewItinerary:function(e){
    wx.navigateTo({
      url: '../../../other/pages/CustomTour/CustomTour',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'uid',
      success: function (res) {
        that.setData({
          uid: res.data
        })
        wx.getStorage({
          key: 'token',
          success: function (res) {
            that.setData({
              token: res.data
            })
            get('/app/customized/order/list/' + that.data.page + '/'+that.data.pageSize, {}, (res) => {
              if (res.data.code == 200) {
                that.setData({
                  list:res.data.data,
                  page: that.data.page + 1
                })
              } else if (res.data.code == 400) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '网络错误 ',
                  icon: 'none',
                  duration: 1000
                })
              }
            }, 1, that.data.token, true, that.data.uid)
          },
        })
      },
    });
   
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
    let that = this
    if (that.data.isHaveMore) {
      get('/app/customized/order/list/' + that.data.page + '/' + that.data.pageSize, {}, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data),
            page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.length > 0 ? true : false
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '网络错误 ',
            icon: 'none',
            duration: 1000
          })
        }
      }, 1, that.data.token, true, that.data.uid)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  }
})