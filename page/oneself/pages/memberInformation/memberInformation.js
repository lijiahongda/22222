import {
  get,
  post,
  isValidID,
  isEmail
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    casArray: ['请点击选择', '男', '女', '保密'],
    DocumentType: ['身份证', '军人证', '护照', '港澳通行证', '台湾通行证', '学生证', '驾驶证'],
    flag: false
  },
  // 电话
  calltel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  // 关于我们
  about:function(){
    wx.navigateTo({
      url: '/page/oneself/pages/about/about',
    })
  },
  // 性别
  bindCasPickerChange: function (e) {
    var that = this;
    that.setData({
      casIndex: e.detail.value
    })
    if (that.data.casArray[e.detail.value] == '男') {
      that.setData({
        gender: 1
      })
    } else if (that.data.casArray[e.detail.value] == '女') {
      that.setData({
        gender: 2
      })
    } else if (that.data.casArray[e.detail.value] == '保密') {
      that.setData({
        gender: 0
      })
    }
    post('/app/member/basic/update/gender', {
      gender: that.data.gender
    }, (res) => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 证件类型
  bindTypeChange: function (e) {
    conosle.log(e.detail.value)
  },
  // 修改密码
  goModifyPassword: function () {
    wx.navigateTo({
      url: '/page/other/pages/login/resetPwd/resetPwd',
    })
  },
  // 昵称-地址-邮箱-地区  修改
  Modification: function (e) {
    // let type = e.currentTarget.dataset.type
    // let value = e.currentTarget.dataset.value
    // wx.navigateTo({
    //   url: '/page/oneself/pages/Modification/Modification?type=' + type + '&value=' + value,
    // })
    wx.navigateTo({
      url: '/page/Yuemall/pages/addressAdministration/addressAdministration'
    })
  },
  changeData: function (e) {
  },
  getOrderList: function () {
    var that = this;
    post('/app/member/info', {}, (res) => {
      if (res.data.code == 200) {
        if (res.data.gender == 1) {
          that.setData({
            casIndex: 1
          })
        } else if (res.data.gender == 2) {
          that.setData({
            casIndex: 2
          })
        } else if (res.data.gender == 0) {
          that.setData({
            casIndex: 3
          })
        }

        that.setData({
          nameHeader: res.data.name,
          name: res.data.name,
          cardType: res.data.cardType,
          img: res.data.avatar,
          cardNo: res.data.cardNo,
          nickname: res.data.nickname,
          mobile: res.data.mobile,
          email: res.data.email,
          country: res.data.country,
          province: res.data.province,
          city: res.data.city,
          district: res.data.district,
          address: res.data.address,
          certifiType: res.data.certifiType,
          tits: res.data.avatar
        })
      } else { }
    }, 1, that.data.token, true, that.data.uid)
  },
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })
    this.getOrderList();
  },
  onPullDownRefresh: function () {
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  onShow: function () {
    wx.setStorageSync('myrequest', '');
  }
})