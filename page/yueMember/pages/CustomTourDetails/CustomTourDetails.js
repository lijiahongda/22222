// pages/yueMember/CustomTourDetails/CustomTourDetails.js
import { get, post, } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    label:[1,2,3],
    currentTab: 0, //预设当前项的值
    call:'4001109600'
  },
  calltel: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.call //仅为示例，并非真实的电话号码
    })
  },
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    }
    else {
      this.setData({
        currentTab: cur
      })
    }
    this.setData({
      toView: "Id" + this.data.currentTab
    })
  },
  ImmediateCustomization:function(e){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    that.setData({
      customized_id: options.customized_id
    })
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
            get('/app/customized/detail/' + that.data.customized_id, {}, (res) => {
              if (res.data.code === 200) {
                that.setData({
                  banner:res.data.data.banner[0],
                  main_title: res.data.data.main_title,
                  start_place: res.data.data.start_place,
                  slave_title: res.data.data.slave_title,
                  price: res.data.data.price,
                  economize_price: res.data.data.economize_price,
                  tags: res.data.data.tags,
                  end_place: res.data.data.end_place,
                  travel_days: res.data.data.travel_days,
                  traffic_style: res.data.data.traffic_style,
                  travel_cities: res.data.data.travel_cities,
                  stay_standard: res.data.data.stay_standard,
                  classic_view: res.data.data.classic_view,
                  has_guide: res.data.data.has_guide,
                  product_desc: res.data.data.product_desc,
                  'type':res.data.data.type,
                  join_number: res.data.data.join_number,
                  satisfaction: res.data.data.satisfaction,
                  expenses_tips: res.data.data.expenses_tips
                })
              } else if (res.code === 400) {
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
  
  }
})