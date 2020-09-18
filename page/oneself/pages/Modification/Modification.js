// page/oneself/pages/Modification/Modification.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    inputValue: ''
  },
  // 昵称-地址-邮箱 获取输入值
  inputValue: function (e) {
    let that = this
    that.setData({
      inputValue: e.detail.value
    })
  },
  //省市区
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  // 保存
  Preservation: function (e) {
    let that = this
    let url = that.data.url
    let obj = {}

    if (that.data.type == '昵称') {
      if (that.data.inputValue == '') {
        wx.showToast({
          title: '请输入要修改的昵称',
          icon: 'none'
        })
        return false
      }
      obj = { name: that.data.inputValue }
    } else if (that.data.type == '地址') {
      if (that.data.inputValue == '') {
        wx.showToast({
          title: '请输入要修的地址',
          icon: 'none'
        })
        return false
      }
      obj = { address: that.data.inputValue }
    } else if (that.data.type == '邮箱') {
      if (that.data.inputValue == '') {
        wx.showToast({
          title: '请输入要修改的邮箱',
          icon: 'none'
        })
        return false
      } else {
        console.log('=====')
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (reg.test(that.data.inputValue)) {
          obj = { email: that.data.inputValue }
        } else {
          wx.showToast({
            title: '请输入正确邮箱格式',
            icon: 'none'
          })
          return false
        }
      }
      
    } else if (that.data.type == 'picker') {
      if (that.data.region.length == 0) {
        wx.showToast({
          title: '请选择要修改的省市区',
          icon: 'none'
        })
        return false
      }
      obj = {
        province: that.data.region[0],
        city: that.data.region[1],
        district: that.data.region[2]
      }
    }
    post(url, obj, (res) => {
      if (res.data.code === 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
        const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
        if (wxPrevPage) {
          if (that.data.type == '昵称') {
            wxPrevPage.setData({
              nickname: that.data.inputValue
            })
          } else if (that.data.type == '地址') {
            wxPrevPage.setData({
              address: that.data.inputValue
            })
          } else if (that.data.type == '邮箱') {
            wxPrevPage.setData({
              email: that.data.inputValue
            })
          } else if (that.data.type == 'picker') {
            wxPrevPage.setData({
              province: that.data.region[0],
              city: that.data.region[1],
              district: that.data.region[2]
            })
          }
        }
        wx.navigateBack()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let title = ''
    let placeholder = ''
    let tips = ''
    let url = ''
    if (options.type == '昵称') {
      title = '修改昵称'
      placeholder = '请填写你的昵称'
      tips = '姓名要求2-20个汉字或2-40个英文，支持空格和""，不能中英混搭'
      url = '/app/member/basic/update/nickname'
    } else if (options.type == '地址') {
      title = '修改地址'
      placeholder = '请填写你的常用地址，非必填'
      tips = '您的地址将默认为收货地址，请确保正确'
      url = '/app/member/basic/update/address'
    } else if (options.type == '邮箱') {
      title = '修改邮箱'
      placeholder = '请填写正确的邮箱地址'
      tips = '邮箱将作为出团通知书'
      url = '/app/member/basic/update/email'
    } else if (options.type == 'picker') {
      title = '修改地区'
      tips = '请选择您所在地区，请确保正确'
      url = '/app/member/basic/update/area'
    }
    wx.setNavigationBarTitle({
      title: title
    })
    that.setData({
      placeholder: placeholder,
      tips: tips,
      url: url,
      type: options.type,
      inputValue: options.value
    })
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

  },
})