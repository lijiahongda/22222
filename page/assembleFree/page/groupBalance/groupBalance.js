import {
  get,
  post
} from '../../../../utils/util.js';
let app = getApp()
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
    address: '',
    isFree: '',
    pttype: '',
    TextArea: '',
    yifen:''
  },
  //点击跳转大礼包
  openMember() {
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },
  // 编辑文字
  bindTextAreaBlur: function(e) {
    this.setData({
      TextArea: e.detail.value
    })
    console.log(e.detail.value)
  },
  // 初始化数据  
  ordergopay: function() {
    let that = this
    console.log(that.data.areaid)
    post('/hd/firmOrder', {
      team_id: that.data.team_id,
      goods_id: that.data.goodid,
      sku_id: that.data.skuid,
      uid: that.data.uid,
      area_id: that.data.areaid,
      goods_num: that.data.goodsnum,
      found_id: that.data.type == 1 ? 0 : that.data.found_id,
      type: that.data.type
    }, (res) => {
      if (res.data.code == 200) {
        let list = res.data.data
        console.log(list)
        console.log(list.productInfo)
        that.setData({
          list: list,
          isFree: list.isFree,
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
        setTimeout(function() {
          wx.navigateBack({})
        }, 2500)
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  // 一分钱初始化数据  
  ordergopayYifen: function() {
    let that = this
    console.log(that.data.areaid)
    post('/mall/draw/balance', {
      activityId: that.data.team_id,
      goodsId: that.data.goodid,
      skuId: that.data.skuid,
      uid: that.data.uid,
      areaId: that.data.areaid,
    }, (res) => {
      if (res.data.code == 200) {
        let list = res.data.data
        console.log(list)
        that.setData({
          listYi: list,
          isFree: list.goodsFreight,
          totelPrice: list.goodsTotalprice,
          productInfo: list.productInfo,
          actualPrice: list.totalPrice,
          isDefault: list.areaInfo.isDefault,
          totalFreight: list.goodsFreight,
          // team: list.team
        })
        if (list.areaInfo != '') {
          that.setData({
            receiverName: list.areaInfo.receiverName,
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
        setTimeout(function() {
          wx.navigateBack({})
        }, 2500)
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
 
  // 支付
  payment: function() {
    console.log('我要支付了', this.data.isgopay)
    let that = this
    let obj = {}
    let url = ''
    that.setData({
      isgopay: false
    })
    if (that.data.yifen && that.data.yifen == 1){
      url = '/mall/draw/CreateOrder'
      obj = {
        areaId: that.data.areaid,
        activityId: that.data.team_id,
        goodsId: that.data.goodid,
        skuId: that.data.skuid,
        uid: that.data.uid,
        areaId: that.data.areaid,
      }
    }else{
      url = '/hd/initLnitiateAGroup'
      obj = {
        team_id: that.data.team_id,
        goods_id: that.data.goodid,
        sku_id: that.data.skuid,
        uid: that.data.uid,
        area_id: that.data.areaid,
        goods_num: that.data.goodsnum,
        type: that.data.type,
        found_id: that.data.type == 1 ? 0 : that.data.found_id,
        shareId: wx.getStorageSync('ortherReCode'),
        channel: 2,
        orderFrom: 1,
        share_form:app.globalData.shareForm,
        position_from:app.globalData.positionFrom
      }
    }
    post(url, obj, (res) => {
      if (that.data.yifen && that.data.yifen == 1) {
        that.setData({
          ordersn: res.data.ordersn
        })
      }else{
        that.setData({
          ordersn: res.data.data.order_sn
        })
      }
      
      if (that.data.type == 1) {
        wx.redirectTo({
          url: '/page/assembleFree/page/InitiateGroup/InitiateGroup?Entrance=' + 'b' + '&ordersn=' + that.data.ordersn + '&type=' + that.data.type,
        })
      } else {
        wx.showLoading({
          title: '支付中',
        });
        if (res.data.code == 200) {
          let obj ={}
          if (that.data.yifen && that.data.yifen == 1){
            obj = {
              ordersn: res.data.ordersn,
              type: 3
            }
          }else{
            obj = {
              ordersn: res.data.data.order_sn,
              type: 3
            }
          }
          post('/app/newMallPay', obj, (res) => {
            if (res.data.code == 200) {
              console.log(that.data.type)
              wx.requestPayment({
                'timeStamp': res.data.pay.getwayBody.timeStamp,
                'nonceStr': res.data.pay.getwayBody.nonceStr,
                'package': res.data.pay.getwayBody.package,
                'signType': 'MD5',
                'paySign': res.data.pay.getwayBody.paySign,
                'success': function(res) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '支付成功',
                    icon: 'none'
                  })
                  if (that.data.yifen && that.data.yifen == 1){
                    wx.redirectTo({
                      url: '/page/Yuemall/pages/invitationDraw/invitationDraw?Entrance=' + 'b' + '&ordersn=' + that.data.ordersn + '&activityId=' + that.data.team_id,
                    })
                  }else{
                    wx.redirectTo({
                      url: '/page/assembleFree/page/InitiateGroup/InitiateGroup?Entrance=' + 'b' + '&ordersn=' + that.data.ordersn + '&type=' + that.data.type + '&id=' + that.data.found_id,
                    })
                  }
                },
                'fail': function(res) {
                  wx.hideLoading()
                  that.setData({
                    isgopay: true
                  })
                  wx.redirectTo({
                    url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + false + '&payType=0' + '&Mywinning=' + 'tuanzhangmianna' + '&address=' + that.data.address + '&mobile=' + that.data.mobile + '&receiverName=' + that.data.receiverName + '&type=' + that.data.type + '&id=' + that.data.found_id
                    //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
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
      }

    }, 1, that.data.token, true, that.data.uid, 4)
  },
  // 添加地址
  addressAdministration: function() {
    wx.navigateTo({
      url: '../addressAdministration/addressAdministration'
    })
  },
  // 显示弹窗
  showModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏弹窗
  hideModal: function() {
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
  onLoad: function(options) {
    let that = this
    console.log(options, '结算options')
    
    console.log(options.goodsnum)
    if (options.yifen && options.yifen == 1) {
      this.setData({
        uid: wx.getStorageSync('uid'),
        token: wx.getStorageSync('token'),
        team_id: options.id,
        goodid: options.goodid,
        skuid: options.skuid,
        areaid: options.areaid,
        goodsnum: options.goodsnum,
        found_id: options.found_id,
        yifen: options.yifen,
      })
      that.ordergopayYifen()
    } else {
      console.log()
      this.setData({
        uid: wx.getStorageSync('uid'),
        token: wx.getStorageSync('token'),
        team_id: options.id,
        goodid: options.goodid,
        skuid: options.skuid,
        areaid: options.areaid,
        goodsnum: options.goodsnum,
        found_id: options.found_id,
        type: options.type,
      })
      that.ordergopay()
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
    this.setData({
      cardType: wx.getStorageSync('cardType')
    })
    console.log(this.data.cardType)
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