// page/other//pages/BindingHousekeeper/BindingHousekeeper.js
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
    reCode: '',
    binding: false
  },
  input: function(e) {
    this.setData({
      reCode: e.detail.value
    })
  },
  complete: function() {
    let that = this
    that.HouseInfo()
  },
  HouseInfo: function() {
    let that = this
    let reCode = 0
    reCode = that.data.reCode ? that.data.reCode : 0
    get('/app/member/v4/getParentInfo/' + reCode, {}, (res) => {
      console.log(res)
      if (res.data.code === 200) {
        that.setData({
          codeNumber: res.data.data.codeNumber,
          headimgurl: res.data.data.headimgurl,
          nickName: res.data.data.nickName
        })
        that.setData({
          binding: true
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
  },
  cancel: function() {
    let that = this
    that.setData({
      binding: false
    })
  },
  Remarks: function() {
    let that = this
    that.HouseInfo()
  },
  // 最终绑定
  sure: function() {
    let that = this
    wx.showToast({
      title: '请稍等...',
      icon: 'none'
    })
    if (that.data.type == 'modify') {
      post('/app/member/basic/update/changeParentByRecode', {
        reCode: that.data.codeNumber
      }, (res) => {
        console.log(res)
        if (res.data.code === 200) {
          wxLogin(function(res) {
            wx.setStorage({
              key: 'isBinding',
              data: res.data.data.status,
            })
            wx.setStorage({
              key: "mapId",
              data: res.data.data.mapId
            });
            wx.setStorage({
              key: 'cardType',
              data: res.data.data.cardType,
            })
            wx.setStorage({
              key: "token",
              data: res.data.data.token
            });
            wx.setStorage({
              key: "uid",
              data: res.data.data.id
            });
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          console.log('/page/Yuemall/pages/balance/balance?type=' + 'gopay' + '&amountnumber=' + that.data.amountnumber + '&goodid=' + that.data.goodid + '&labelName=' + that.data.labelName + '&leaderId=' + that.data.leaderId + '&skuid=' + that.data.skuid + '&addressIds=' + that.data.addressIds + '&areaId=' + that.data.areaId + '&addressType=' + that.data.addressType)
          setTimeout(function() {
            wx.navigateTo({
              url: '/page/Yuemall/pages/balance/balance?type=' + 'gopay' + '&amountnumber=' + that.data.amountnumber + '&goodid=' + that.data.goodid + '&labelName=' + that.data.labelName + '&leaderId=' + that.data.leaderId + '&skuid=' + that.data.skuid + '&addressIds=' + that.data.addressIds + '&areaId=' + that.data.areaId + '&addressType=' + that.data.addressType + '&ismodify=' + 'ismodify',
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
    } else {
      post('/app/member/v4/bindWx', {
        mapId: wx.getStorageSync('mapId'),
        mobile: that.data.mobile,
        areaCode: that.data.countryCode,
        country: that.data.countryName,
        codeNumber: that.data.codeNumber,
        applicationId: 40
      }, (res) => {
        console.log(res)
        if (res.data.code === 200) {
          wxLogin(function(res) {
            wx.setStorage({
              key: 'isBinding',
              data: res.data.data.status,
            })
            wx.setStorage({
              key: "mapId",
              data: res.data.data.mapId
            });
            wx.setStorage({
              key: 'cardType',
              data: res.data.data.cardType,
            })
            wx.setStorage({
              key: "token",
              data: res.data.data.token
            });
            wx.setStorage({
              key: "uid",
              data: res.data.data.id
            });
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          wx.setStorage({
            key: "uid",
            data: res.data.data.id
          });
          wx.setStorage({
            key: "token",
            data: res.data.data.token
          });
          setTimeout(function() {
            wx.navigateBack({
              delta: 2
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      reCode: options.reCode,
      mobile: options.mobile,
      countryCode: options.countryCode,
      countryName: options.countryName,
      type: options.type
    })
    if (options.type == 'modify') {
      that.setData({
        amountnumber: options.amountnumber,
        goodid: options.goodid,
        labelName: options.labelName,
        leaderId: options.leaderId,
        skuid: options.skuid,
        addressIds: options.addressIds,
        areaId: options.areaId,
        addressType: options.addressType
      })
    }
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