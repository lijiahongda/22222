import {
  get,
  post
} from '../../../../utils/util.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false, //弹窗状态,
    cartId: '',
    receiverName: '',
    mobile: '',
    address: '',
    totelPrice: '',
    couponList: [],
    DiscountAmount: '',
    actualPrice: '',
    totelPrice: '',
    isAble: 0,
    couponid: '',
    addressId: '',
    isDefault: 0,
    Able: 0,
    addressAdministration: '',
    labelName: '',
    addressType: 0,
    addressIds: 0,
    areaid: 0,
    ispay: '',
    isgopay: true,
    address: ''
  },
  // 加入会员
  join: function (e) {
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },
  // 初始化数据  
  ordergopay: function () {
    let that = this
    console.log(that.data.areaid)
    post('/hd/firmOrder', {
      team_id: that.data.team_id,
      goods_id: that.data.goodid,
      sku_id: that.data.skuid,
      uid: that.data.uid,
      area_id: that.data.areaid,
      goods_num: that.data.goodsnum,
      found_id: that.data.found_id == '' ? 0 : that.data.found_id,
      type: that.data.type
    }, (res) => {
      if (res.data.code == 200) {
        let list = res.data.data
        console.log(list)
        console.log(list.productInfo)
        that.setData({
          list: list,
          totelPrice: list.goodsTotalprice,
          productInfo: list.productInfo,
          actualPrice: list.totalPrice,
          isDefault: list.areaInfo.is_default,
          totalFreight: list.goodsreight,
          team: list.team
        })
        if (list.areaInfo != '') {
          that.setData({
            receiverName: list.areaInfo.receiver_name,
            mobile: list.areaInfo.mobile,
            address: list.areaInfo.proviceName + list.areaInfo.cityName + list.areaInfo.zoneName + list.areaInfo.townName + list.areaInfo.address,
            areaid: list.areaInfo.addressId
          })
        }

      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        setTimeout(function () {
          wx.navigateBack({})
        }, 2500)
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  // 支付
  payment: function () {
    let that = this
    wx.showLoading({
      title: '支付中',
    });
    that.setData({
      isgopay: false
    })
    console.log(that.data.areaid, 'area_id')
    post('/hd/initLnitiateAGroup', {
      team_id: that.data.team_id,
      goods_id: that.data.goodid,
      sku_id: that.data.skuid,
      uid: that.data.uid,
      area_id: that.data.areaid,
      goods_num: that.data.goodsnum,
      type: that.data.type,
      found_id: that.data.found_id,
      shareId: wx.getStorageSync('ortherReCode'),
      channel: 3,
      orderFrom: 7,
      share_form: app.globalData.shareForm,
      position_from: app.globalData.positionFrom
    }, (res) => {
      console.log(res)
      that.setData({
        ordersn: res.data.data.order_sn
      })
      if (res.data.code == 200) {
        post('/app/newMallPay', {
          ordersn: res.data.data.order_sn,
          type: 3
        }, (res) => {
          if (res.data.code == 200) {
            console.log(that.data.type)
            wx.requestPayment({
              'timeStamp': res.data.pay.getwayBody.timeStamp,
              'nonceStr': res.data.pay.getwayBody.nonceStr,
              'package': res.data.pay.getwayBody.package,
              'signType': 'MD5',
              'paySign': res.data.pay.getwayBody.paySign,
              'success': function (res) {
                wx.hideLoading()
                wx.showToast({
                  title: '支付成功',
                  icon: 'none'
                })
                wx.redirectTo({
                  url: '/page/Yuemall/pages/InitiateGroup/InitiateGroup?Entrance=' + 'b' + '&ordersn=' + that.data.ordersn + '&type=' + that.data.type,
                })
              },
              'fail': function (res) {
                wx.hideLoading()
                that.setData({
                  isgopay: true
                })
                wx.redirectTo({
                  url: '/page/Yuemall/pages/InitiateGroup/InitiateGroup?Entrance=' + 'b' + '&ordersn=' + that.data.ordersn + '&type=' + that.data.type + '&isfail=' + 'fail'
                })
              },
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 1, that.data.token, true, that.data.uid)

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  // 添加地址
  addressAdministration: function () {
    wx.navigateTo({
      url: '../addressAdministration/addressAdministration'
    })
  },
  // 显示弹窗
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏弹窗
  hideModal: function () {
    this.setData({
      showModalStatus: false
    })
    // 隐藏遮罩层
    this.setData({
      showModalStatus: false,
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options, '结算options')
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      team_id: options.id,
      goodid: options.goodid,
      skuid: options.skuid,
      areaid: options.areaid,
      goodsnum: options.goodsnum,
      found_id: options.found_id,
      type: options.type
    })
    console.log(options.goodsnum)
    this.ordergopay()
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