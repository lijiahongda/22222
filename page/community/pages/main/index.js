// page/community/pages/main/index.js
const app = getApp()
import {
  post,
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 群tab的下标
    tabIndex: 1,
    // 假数据
    list: ['1', '2', '3'],
    model: false,
    ERM: false,
    text: false,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    if (!wx.getStorageSync('uid')) {
      this.VerificationCode()
    }else{
      if(app.globalData.isSetList){
        this.getData()
        this.getqunData(1)
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onUnload:function(){
    app.globalData.isSetList = true
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.getqunData()
  },
  // 手机号验证码
  VerificationCode: function () {
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber' + that.data.codeNumber
    })
  },
  // 群tab点击事件
  groupTabC(e) {
    var value = e.currentTarget.dataset.value
    console.log(value)
    this.setData({
      tabIndex: value
    })
    this.getqunData(value)
  },
  getData: function () {
    let that = this
    post('/community/group/activationIndex', {
      // uid: 67,
      uid: wx.getStorageSync('uid'),
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          userInfo: res.data.data.userInfo,
          actiNum: res.data.data.actiNum,
          notActiNum: res.data.data.notActiNum,
          qrCode: res.data.data.qrCode,
          groupSaleGoodsData: res.data.data.groupSaleGoodsData
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  },
  getqunData: function (value) {
    let that = this
    post('/community/group/groupActivationList', {
      type: Number(value), //0 未激活  1激活
      page: that.data.page,
      pageSize: 10,
      // uid:67,
      uid: wx.getStorageSync('uid'),
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          page: that.data.pag + 1,
          list: that.data.list.concat(res.data.data)
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  },

  // 打开群
  opengroup(e) {
    console.log(e, '00000000')
    let roomid = e.currentTarget.dataset.roomid
    if (this.data.tabIndex == '0') {
      wx.navigateTo({
        url: '/page/community/pages/main/group/noactivation/index?room_id=' + roomid,
      })
    } else {
      wx.navigateTo({
        url: '/page/community/pages/main/group/activation/index?room_id=' + roomid,
      })
    }
  },
  // 打开商品列表
  commodities() {
    wx.navigateTo({
      url: '/page/community/pages/main/commodities/index',
    })
  },
  // 点击弹框显示
  show: function (e) {
    console.log('-----0000000')
    this.setData({
      model: e.detail.model
    })
  },
  // 弹框消失
  modelClose: function () {
    this.setData({
      model: false
    })
  },
  savePic: function () {
    wx.downloadFile({
      url: this.data.qrCode,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail: function (res) {}
        })
      },
      fail: function () {
        wx.showToast({
          title: res.errMsg,
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
  }
})