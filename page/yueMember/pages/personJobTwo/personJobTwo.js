// page/yueMember//pages/personJob/personJob.js
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
    name:'',
    bank:'',
    alipay:'',
    upload:true,
    wxImg:''
  },
  // 姓名
  // nameInput: function(e) {
  //   let that = this
  //   that.setData({
  //     name: e.detail.value
  //   })
  // },
  // // 银行卡号
  // bankInput: function (e) {
  //   let that = this
  //   that.setData({
  //     bank: e.detail.value
  //   })
  // },
  // // 支付宝号
  // alipayInput: function (e) {
  //   let that = this
  //   that.setData({
  //     alipay: e.detail.value
  //   })
  // },
  loadImg: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.urlTobase64('data:image/jpg;base64,' + res.data)
          }
        })
      }
    })
  },
  urlTobase64(url, type) {
    let that = this
    wx.request({
      url: 'https://api2.yuelvhui.com/common/uploadBase64', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        file: url
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          wxImg: res.data.url
        })
      }
    })
  },

  //提交申请/申请兼职(姓名 手机号 身份证号 城市 负责人)
  save: function (){
    let that = this
    if (!that.data.name || !that.data.bank) {
      wx.showToast({
        title: '请联系上级获取支付信息',
        icon: 'none'
      })
      return
    }
    if (!that.data.wxImg){
      wx.showToast({
        title: '请上传支付凭证',
        icon:'none'
      })
      return
    }
    let obj={
      // name: that.data.name,
      // bank: that.data.bank,
      // alipay: that.data.alipay,
      proveImage: that.data.wxImg,
      applyType: that.data.type,
      wid: that.data.wid,
      applyNum: that.data.cont.applyNum
    }
    console.log(obj)
    // return
    post('/partTime/addWork', obj, (res) => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        that.setData({
          status:0
        })
        wx.navigateBack({
          delta: 1,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options,'opti')
    that.setData({
      type: options.type,
      cont: JSON.parse(options.cont)
    })
    console.log(that.data.cont,'cont')
    that.list()
  },
  list:function(){
    let that = this
    post('/partTime/checkApplyInfo', {
      applyType : that.data.type
    }, (res) => {
        console.log(res, 111)
      if (res.data.code == 200) {
        that.setData({
          bank: res.data.data.bank.bankCard,
          alipay: res.data.data.bank.bankName,
          name: res.data.data.bank.userName,
          mobile: res.data.data.bank.mobile,
          notice: res.data.data.notice,
          wid: res.data.data.wid,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  copy:function(e){
    console.log(e.currentTarget.dataset.item)
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.dataset.item,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  }
})