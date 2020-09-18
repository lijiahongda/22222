import {
  get,
  post,
  isValidID,
  isEmail
} from '../../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    currentTab: '3',
    url1: '../../../../../mages/EntityCard/borderAfter.png',
    url2: '../../../../../images/EntityCard/border.png',
    url3: '../../../../../images/EntityCard/border.png',
    ide: '',
    leavecity: '',
    aimcity: '',
    adjusttime: '',
    adultnum: '',
    childnum: '',
    budget: '',
    adjustbudget: '',
    starttime: '',
    endtime: '',
    EnterpriseName: '',
    contacts: '',
    mobile: '',
    Email: '',
    remarks: '',
    types: '',
    quantity: 0,
    color: '#ccc',
    isColor: true
  },
  BlurBudget: function(e) {
    this.setData({
      color: '#f4aa11',
      isColor: false
    })
  },
  //企业名称
  bindEnterpriseName: function(e) {
    let val = e.detail.value;
    this.setData({
      EnterpriseName: val
    });
  },
  //联系人姓名
  bindKinName: function(e) {
    let val = e.detail.value;
    this.setData({
      contacts: val
    });
  },
  //联系电话
  bindKinphone: function(e) {
    let val = e.detail.value;
    this.setData({
      mobile: val
    });
  },
  //邮箱
  bindEmail: function(e) {
    let val = e.detail.value;
    this.setData({
      Email: val
    });
  },
  //更多服务
  bindTextAreaBlur: function(e) {
    this.setData({
      remarks: this.data.remarks
    })
  },
  bindTextarea: function(e) {
    this.setData({
      remarks: e.detail.value,
      quantity: e.detail.value.length
    })
  },
  bindNumber: function(e) {
    let val = e.currentTarget.dataset.title
    if (val == 3) {
      this.setData({
        currentTab: '3',
        url1: '../../../../../images/EntityCard/borderAfter.png',
        url2: '../../../../../images/EntityCard/border.png',
        url3: '../../../../../images/EntityCard/border.png'
      })
    } else if (val == 2) {
      this.setData({
        currentTab: '2',
        url1: '../../../../../images/EntityCard/border.png',
        url2: '../../../../../images/EntityCard/borderAfter.png',
        url3: '../../../../../images/EntityCard/border.png'
      })
    } else if (val == 1) {
      this.setData({
        currentTab: '1',
        url1: '../../../../../images/EntityCard/border.png',
        url2: '../../../../../images/EntityCard/border.png',
        url3: '../../../../../images/EntityCard/borderAfter.png'
      })
    }
  },
  nextStep: function(e) {
    var that = this;
    if (that.data.ide == '私人订制') {
      that.setData({
        types: 1
      })
    } else if (that.data.ide == '企业定制') {
      that.setData({
        types: 2
      })
    }
    if (this.data.ide == '企业定制') {
      if (this.data.EnterpriseName == '') {
        wx.showToast({
          title: '企业名称不能为空',
          icon: 'none',
          duration: 1000
        });
        return false
      }
    }
    if (this.data.contacts == '') {
      wx.showToast({
        title: '联系人姓名不能为空',
        icon: 'none',
        duration: 1000
      });
      return false
    }
    if (this.data.mobile == '') {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none',
        duration: 1000
      });
      return false
    }
    post('/app/customized/create', {
      'type': that.data.types,
      leavecity: that.data.leavecity,
      aimcity: that.data.aimcity,
      starttime: that.data.starttime,
      endtime: that.data.endtime,
      adultnum: that.data.adultnum.substring(0, that.data.adultnum.length - 2),
      childnum: that.data.childnum.substring(0, that.data.childnum.length - 2),
      budget: that.data.budget,
      contacts: that.data.contacts,
      mobile: that.data.mobile,
      email: that.data.Email,
      enterprise_name: that.data.EnterpriseName,
      customer_number: that.data.currentTab,
      remarks: that.data.remarks,
      payType: 'WX_JSAPP',
      applicationId: '40'
    }, (res) => {
      wx.requestPayment({
        'timeStamp': res.data.data.getwayBody.timeStamp,
        'nonceStr': res.data.data.getwayBody.nonceStr,
        'package': res.data.data.getwayBody.package,
        'signType': res.data.data.getwayBody.signType,
        'paySign': res.data.data.getwayBody.paySign,
        'success': function(res) {
          wx.showToast({
            //title: res.data.msg,
            title: '提交成功，请等待',
            icon: 'none',
            duration: 1000
          });
        },
        'fail': function(res) {
        },
      })
    }, 1, that.data.token, true, that.data.uid)
  },
  onLoad: function(options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      ide: options.ide,
      leavecity: options.leavecity,
      aimcity: options.aimcity,
      adjusttime: options.adjusttime,
      adultnum: options.adultnum,
      childnum: options.childnum,
      budget: options.budget,
      adjustbudget: options.adjustbudget,
      starttime: options.starttime,
      endtime: options.endtime
    })
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
  onShow: function() {

  }
})