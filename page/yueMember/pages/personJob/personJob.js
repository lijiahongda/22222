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
    scrollUp: false, //弹框
    status: 0, //审核参数
    changeRed: '#f00',
    select_city: '',
    select_people: '',
    // id_card:'',
    phone: '',
    name: '',
    index: '',
    purchase: 1,
    applyNum: 0,
    num: 1,
  },
  // 姓名
  name: function(e) {
    let that = this
    that.setData({
      name: e.detail.value
    })
  },
  // 再次申请
  AgainSize: function() {
    let that = this
    that.setData({
      status: 0
    })
    that.initData()
  },
  //手机号
  phone: function(e) {
    let that = this
    that.setData({
      phone: e.detail.value
    })
  },
  // 身份证号
  // id_card: function (e) {
  //   let that = this
  //   that.setData({
  //     id_card: e.detail.value
  //   })
  // },
  bindPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      select_city: this.data.city[e.detail.value]
    })
  },
  // 城市区域
  // select_city: function (e) {
  //   let that = this
  //   that.setData({
  //     select_city: e.detail.value
  //   })
  // },

  // 加
  plus: function() {
    let that = this
    let num = that.data.num
    let applyNum = that.data.applyNum
    if (!(that.data.applyNum >= that.data.applyInfo[0].maxApplyNum)) {
      console.log(num)
      num += 1
      console.log(num)
      console.log(that.data.applyInfo[0].applyNum)
      applyNum = num * that.data.applyInfo[0].applyNum
      console.log(applyNum)
      that.setData({
        applyNum: applyNum,
        num: num
      })
    }
    console.log(that.data.applyNum)
  },
  // 减
  reduce: function() {
    let that = this
    if (!(that.data.applyNum <= that.data.applyInfo[0].applyNum)) {
      that.data.num = that.data.num - 1
      that.data.applyNum = that.data.num * that.data.applyInfo[0].applyNum
      that.setData({
        applyNum: that.data.applyNum,
        num: that.data.num
      })
    }
  },
  // 键入
  applyBlur: function(e) {
    let that = this
    if (that.data.applyInfo[0].applyNum == 1 || that.data.applyInfo[0].applyNum == 15  ){
      if (e.detail.value > that.data.applyInfo[0].maxApplyNum) {
        wx.showToast({
          title: '不能大于' + that.data.applyInfo[0].maxApplyNum,
          icon: 'none'
        })
        that.setData({
          applyNum: that.data.applyInfo[0].applyNum
        })
      } else if (e.detail.value < that.data.applyInfo[0].applyNum) {
        wx.showToast({
          title: '不能小于' + that.data.applyInfo[0].applyNum,
          icon: 'none'
        })
        that.setData({
          applyNum: that.data.applyInfo[0].applyNum
        })
      } else {
        if (e.detail.value % that.data.applyInfo[0].applyNum == 0) {
          that.setData({
            applyNum: e.detail.value,
            num: Number(e.detail.value / that.data.applyInfo[0].applyNum)
          })
        } else {
          wx.showToast({
            title: '请输入' + that.data.applyInfo[0].applyNum + '的倍数',
            icon: 'none'
          })
          that.setData({
            applyNum: that.data.applyInfo[0].applyNum
          })
        }
      }
    }
  },
  // 负责人
  select_people: function(e) {
    let that = this
    that.setData({
      select_people: e.detail.value
    })
  },
  //下面的地址框弹出
  scrollUp: function(e) {
    let that = this
    that.setData({
      scrollUp: true
    })
  },
  //点击取消
  concel: function(e) {
    let that = this
    that.setData({
      scrollUp: false
    })
  },
  //点击确定
  dateTime: function(e) {
    let that = this
    that.setData({
      scrollUp: false,
    })
  },
  //提交申请
  submitBtn: function(e) {
    let that = this;
    // console.log(that.data.purchase,'purchase')
    // return
    if (that.data.purchase == 2) {
      that.data.jobTwo = that.data.applyInfo[1]
    } else {
      that.data.jobTwo = that.data.applyInfo[0]
    }
    that.data.applyInfo[0].applyNum = that.data.applyNum
    // console.log('/page/yueMember/pages/personJobTwo/personJobTwo?type=' + that.data.purchase + '&cont=' + JSON.stringify(that.data.jobTwo))
    wx.navigateTo({
      url: '/page/yueMember/pages/personJobTwo/personJobTwo?type=' + that.data.purchase + '&cont=' + JSON.stringify(that.data.jobTwo),
    })
    return

    that.initSubmit()
  },
  // 采购数量
  purchaseChose: function(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let item = e.currentTarget.dataset.item

    that.setData({
      purchase: type,
      // jobTwo:that.data.jobTwo
    })

  },

  // 初始化我要创业信息接口-- 城市信息 banner 简介
  initData: function() {
    let that = this
    post('/partTime/getCity', {}, (res) => {
      if (res.data.code == 200) {
        // console.log(res.data.data.city, 111)
        that.setData({
          banner: res.data.data.banner,
          desc: res.data.data.desc,
          city: res.data.data.city,
        })

      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  // 页面显示状态
  initSatus: function() {
    let that = this;
    post('/partTime/checkStatusOne', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          status: res.data.data.status, //,//0 未申请 1 待审核 2 审核通过 3 被驳回 4 未实名认证(跳实名认证页面)
          name: res.data.data.identify.userName,
          phone: res.data.data.identify.mobile,
          id_card: res.data.data.identify.idCard,
          applyInfo: res.data.data.applyInfo,
        })
        if (res.data.data.applyInfo) {
          that.setData({
            purchase: res.data.data.applyInfo[0].applyType,
            applyNum: res.data.data.applyInfo[0].applyNum
          })
        }
        if (res.data.data.status == 0) { //未申请
          that.initData()
        }
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },

  //提交申请/申请兼职(姓名 手机号 身份证号 城市 负责人)
  initSubmit: function() {
    let that = this
    post('/partTime/addPartTime', {
      select_city: that.data.select_city,
      select_people: that.data.select_people,
      // id_card: that.data.id_card,
      name: that.data.name,
      phone: that.data.phone
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res, 111)
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        that.setData({
          status: 0
        })

      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // that.initSatus()
  },
  //点击城市显示城市地址
  scrollSize: function(e) {
    let that = this
    // console.log(e.currentTarget.dataset.city)
    this.setData({
      select_city: e.currentTarget.dataset.city
    })
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
    this.initSatus()
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