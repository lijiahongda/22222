// page/community/pages/main/group/noactivation/index.js
import {
  get,
  post,
  relations,
  retrunScene,
} from '../../../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['1', '1', '2', '4'],
    lists: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1],
    eject: 0, //是否弹出分享，0-不弹出1-弹出
    ERM: true,
    text: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    if (wx.getStorageSync('uid')) {
      that.setData({
        room_id: options.room_id
      })
      this.getData()
    } else {
      this.VerificationCode()
    }
    
  },
  // 打开商品列表
  commodities() {
    wx.navigateTo({
      url: '/page/community/pages/main/commodities/index',
    })
  },
  getData: function() {
    let that = this
    console.log(wx.getStorageSync('uid'),'88888888888888888')
    post('/community/group/noActivationRoomById', {
      // uid: 67,
      room_id: that.data.room_id,
      uid: wx.getStorageSync('uid'),
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res.data.data.eject, '-00000000000======',wx.getStorageSync('uid'),'99999999')
        that.setData({
          userInfo: res.data.data.userInfo,
          actiNum: res.data.data.actiNum,
          notActiNum: res.data.data.notActiNum,
          qrCode: res.data.data.qrCode,
          goodsData: res.data.data.goodsData,
          haveActivation: res.data.data.haveActivation,
          groupType: res.data.data.groupType,
          eject: res.data.data.eject,
        })
        
        console.log('groupType是', that.data.groupType,'4444444444444444')
        that.getShare(res.data.data.userInfo.uid)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)

  },
  getShare: function(uid) {
    let that = this
    post('/share/activationShareXcx', {
      mid: uid,
      room_id: that.data.room_id,
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          title: res.data.title,
          desc: res.data.desc,
          showImg: res.data.showImg
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 手机号验证码
  VerificationCode: function () {
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber=' + that.data.reCode
    })
  },
  close(){
    let that = this
    console.log(that.data.groupType,'1111111111111111111111')
    if (that.data.groupType == 1){
      console.log('88888888888,现在的groupType是',that.data.groupType)
      that.setData({
        eject: 0
      })
    } else if (that.data.groupType == 2){
      console.log('999999999999,十个人了，现在的groupType是', that.data.groupType)
      that.setData({
        eject: 0
      })
      wx.navigateTo({
        url: '/page/community/pages/main/commodities/index',
      })
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let that = this
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {

    }
    console.log(res)
    console.log("page/community/pages/main/group/noactivation/index" + "?reCode=" + value + "&room_id=" + that.data.room_id)
    return {
      title: that.data.title,
      imageUrl: that.data.showImg,
      path: "page/community/pages/main/group/noactivation/index" + "?reCode=" + value + "&room_id=" + that.data.room_id

    }

  },

})