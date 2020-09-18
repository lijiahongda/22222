// pages/YueMall/addressAdministration/addressAdministration.js
import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    authorizationStatus:true,
    delBtnWidth: 121,//删除按钮宽度单位（rpx）
    Mywinning: ''
  },
  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  // 选择地址
  SelectAddress: function (e) {
    console.log(e.currentTarget.dataset.item)
    if (this.data.isElite == 'elite') {
      console.log('领取')
      post('/app/card/getSendGoods', {
        ordersn: this.data.orderNo,
        addressId: e.currentTarget.dataset.addressid
      }, (res) => {
        console.log(res)
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/page/yueMember/pages/SuccessfulReception/SuccessfulReception',
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    } else {
      const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
      const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
      if (wxPrevPage) {
        if (this.data.Mywinning == 'Mywinning') {
          wxPrevPage.setData({
            page: 1,
            receiverName: e.currentTarget.dataset.receivername,
            mobile: e.currentTarget.dataset.mobile,
            address: e.currentTarget.dataset.address,
            isReceive: true
          })
          wx.navigateBack()
        } else if (this.data.Mywinning == 'datil') {//商品详情
          wxPrevPage.setData({
            address: e.currentTarget.dataset.item,
            isaddress: true,
            addressCode: e.currentTarget.dataset.item.proviceId + '_' + e.currentTarget.dataset.item.cityId + '_' + e.currentTarget.dataset.item.zoneId + '_' + e.currentTarget.dataset.item.townId,
            state: 1,
            confirmSiteType: 1, // 订单确定地址的弹窗，0-显示地址，1-直接下单跳转
            confirmSiteShow: false
          })
          wxPrevPage.skuidDetil()
          wx.navigateBack()
        } else if (this.data.Mywinning == 'datilAss') {//
          wxPrevPage.setData({
            address: e.currentTarget.dataset.item,
            areaid: e.currentTarget.dataset.addressid,
            isaddress: true,
            addressCode: e.currentTarget.dataset.item.proviceId + '_' + e.currentTarget.dataset.item.cityId + '_' + e.currentTarget.dataset.item.zoneId + '_' + e.currentTarget.dataset.item.townId,
            state: 1,
            confirmSiteType:1, // 订单收货的地址确认
            confirmSiteShow:false
          })
          wx.navigateBack()
        } else if (this.data.Mywinning == 'dalibao'){
          console.log('=========')
          post('/app/member/updateAddressNew', {
            orderNo: this.data.orderNo,
            uid: wx.getStorageSync('uid'),
            addressId: e.currentTarget.dataset.addressid
          }, (res) => {
            if (res.data.code == 200) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
        } else {
          wxPrevPage.setData({
            page: 1,
            receiverName: e.currentTarget.dataset.receivername,
            mobile: e.currentTarget.dataset.mobile,
            address: e.currentTarget.dataset.address,
            addressId: e.currentTarget.dataset.addressid,
            isDefault: e.currentTarget.dataset.isdefault,
            isaddress: e.currentTarget.dataset.item,
            addressType: 1,
            addressIds: e.currentTarget.dataset.areaid,
            areaId: e.currentTarget.dataset.addressid,
            areaid: e.currentTarget.dataset.addressid,
            confirmSiteType: 1,
            confirmSiteShow: false
          })
          wx.navigateBack()
        }
      }
    }
  },
  // 初始化数据
  orderList: function () {
    let that = this
    post('/app/mall/address/list', {}, (res) => {
      if (res.data.status == 200) {
        for (let item of res.data.data) {
          item.txtStyle = ''
        }
        that.setData({
          list: res.data.data
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 新建地址
  ImmediateSettlement: function (e) {
    wx.navigateTo({
      url: '../editAddress/editAddress?type=' + e.currentTarget.dataset.type + '&isElite=' + this.data.isElite + '&orderNo=' + this.data.orderNo,
    })
  },
  // 编辑
  edit: function (e) {
    wx.navigateTo({
      url: '../editAddress/editAddress?provicename=' + e.currentTarget.dataset.provicename + '&cityname=' + e.currentTarget.dataset.cityname + '&zonename=' + e.currentTarget.dataset.zonename + '&receivername=' + e.currentTarget.dataset.receivername + '&mobile=' + e.currentTarget.dataset.mobile + '&address=' + e.currentTarget.dataset.address + '&addressId=' + e.currentTarget.dataset.addressid + '&isDefault=' + e.currentTarget.dataset.isdefault + '&type=' + e.currentTarget.dataset.type + '&townName=' + e.currentTarget.dataset.townname + '&proviceId=' + e.currentTarget.dataset.proviceid + '&cityId=' + e.currentTarget.dataset.cityid + '&zoneId=' + e.currentTarget.dataset.zoneid + '&townId=' + e.currentTarget.dataset.townid,
    })
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }

      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index]['txtStyle'] = txtStyle;
      //更新列表的状态
      this.setData({
        'list': list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        'list': list
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  /**
     * 删除事件
     */
  delItem: function (e) {
    let that = this
    post('/app/mall/address/delete', {
      addressId: e.currentTarget.dataset.addressid
    }, (res) => {
      if (res.data.status == 200) {
        for (let item of res.data.result) {
          item.txtStyle = ''
        }
        that.setData({
          list: res.data.result
        })
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      Mywinning: options.Mywinning,
      isElite: options.isElite,
      orderNo: options.orderNo
    })
    console.log(options.Mywinning)
    that.initEleWidth();
    that.orderList()
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
    let that = this
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
      that.setData({
        authorizationStatus: true
      })
    }
    that.orderList()
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
    console.log('======+++++++++==========点击')
    if (this.data.Mywinning == 'dalibao'){
      wx.navigateBack({
        delta: 2
      })
    }
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