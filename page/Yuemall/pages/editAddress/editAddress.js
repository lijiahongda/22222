import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    uid: '',
    token: '',
    list: [],
    // region: ['省份', '城市', '区县'],
    customItem: '全部',
    proviceName: '',
    cityName: '',
    zonename: '',
    address: '',
    receivername: '',
    mobile: '',
    isDefault: 0,
    addressId: '',
    isconservation: true,
    Status: false,
    url: '/app/mall/jd/getProvince',
    provinceId: '',
    province: '请选择',
    isprovince: true,
    city: '请选择',
    cityId: '',
    iscity: false,
    area: '请选择',
    areaId: '',
    isarea: false,
    Town: '请选择',
    TownId: 0,
    isTown: false,

  },
  // 详细地址
  detailed: function(e) {
    let that = this;
    that.setData({
      address: e.detail.value
    })
  },
  // 姓名
  name: function(e) {
    let that = this;
    that.setData({
      receivername: e.detail.value
    })
  },
  // 电话
  Phone: function(e) {
    let that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        Status: false
      })
    }.bind(this), 200)
  },
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
      Status: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  // 默认加载省接口
  defaultData: function(e) {
    let that = this
    that.setData({
      isprovince: true,
      iscity: false,
      isarea: false,
      isTown: false
    })
    if (that.data.TownId) {
      that.setData({
        isTown: true
      })
    }
    get(that.data.url, {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          provincelist: res.data.data
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 选择省-加载市数据
  Selectprovince: function(e) {
    let that = this;
    that.setData({
      city: '请选择',
      area: '请选择',
      Town: '请选择',
      cityId: '',
      areaId: '',
      TownId: '',
    })
    if (e.currentTarget.dataset.id) {
      that.setData({
        provinceId: e.currentTarget.dataset.id,
      })
    }
    console.log(e.currentTarget)
    that.setData({
      provinceId: that.data.provinceId,
      province: e.currentTarget.dataset.name,
      isprovince: false,
      iscity: true,
    })
    get('/app/mall/jd/getCity?province_id=' + that.data.provinceId, {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          citylist: res.data.data
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 选择市-加载区数据
  SelectCity: function(e) {
    let that = this;
    if (e.currentTarget.dataset.id) {
      that.setData({
        cityId: e.currentTarget.dataset.id,
      })
    }
    that.setData({
      cityId: that.data.cityId,
      city: e.currentTarget.dataset.name,
      isprovince: false,
      iscity: false,
      isarea: true
    })
    get('/app/mall/jd/getArea?city_id=' + that.data.cityId, {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          arealist: res.data.data
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  // 选择区-加载街道数据
  Selectarea: function(e) {
    let that = this;
    that.setData({
      areaId: that.data.areaId,
      area: e.currentTarget.dataset.name,
      isprovince: false,
      iscity: false,
      isarea: false,
      isTown: true
    })
    if (e.currentTarget.dataset.id) {
      that.setData({
        areaId: e.currentTarget.dataset.id,
      })
    }
    get('/app/mall/jd/getTown?area_id=' + that.data.areaId, {}, (res) => {
      if (res.data.code == 200) {
        if (res.data.data == '') {
          that.hideModal()
          that.setData({
            isarea: true,
            isTown: false,
            Town: ''
          })
        } else {
          that.setData({
            Townlist: that.data.Townlist ? that.data.Townlist : res.data.data,
            isarea: false,
            isTown: true
          })
        }
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  //选择街道
  SelectTown: function(e) {
    let that = this
    that.setData({
      TownId: e.currentTarget.dataset.id,
      Town: e.currentTarget.dataset.name,
    })
    that.hideModal()
  },
  // 省市区
  LocationMore: function(e) {
    let that = this;
    that.showModal()
  },
  // bindRegionChange: function(e) {
  //   this.setData({
  //     region: e.detail.value
  //   })
  // },
  // 是否设为默认地址
  checkboxChange: function() {
    this.setData({
      isDefault: this.data.isDefault == 0 ? 1 : 0
    })
    console.log(this.data.isDefault)
  },
  // 保存
  conservation: function() {
    let that = this;
    console.log(that.data.province)
    if (that.data.province == '请选择' || that.data.province == '') {
      wx.showToast({
        title: '请选择省市区城镇',
        icon: 'none'
      })
      return
    }
    console.log(that.data.Town)
    if (that.data.isTown) {
      if (that.data.Town == '请选择') {
        wx.showToast({
          title: '请选择城镇',
          icon: 'none'
        })
        return
      }
    }
    if (that.data.address == '') {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
      return
    }
    if (that.data.receivername == '') {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return
    }
    if (that.data.mobile == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return
    }
    if (that.data.address == '详细地址，如街道、楼牌号等') {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
      return
    }
    if (that.data.receivername == '姓名') {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return
    }
    if (that.data.mobile == '手机号') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return
    }
    that.setData({
      isconservation: false
    })
    console.log(that.data.province,that.data.provinceId)
    post('/app/mall/address/create', {
      proviceName: that.data.province,
      cityName: that.data.city,
      zoneName: that.data.area,
      townName: that.data.Town == '请选择' ? '' : that.data.Town,
      address: that.data.address,
      receiverName: that.data.receivername,
      mobile: that.data.mobile,
      addressId: that.data.addressId,
      isDefault: that.data.isDefault,
      proviceId: that.data.provinceId,
      cityId: that.data.cityId,
      zoneId: that.data.areaId,
      townId: that.data.TownId
    }, (res) => {
      console.log(res,'=========')
      if (res.data.status == 200) {
        wx.showToast({
          title: '成功',
          icon: 'none'
        })

        if (that.data.isElite == 'elite') {
          console.log('领取')
          post('/app/card/getSendGoods', {
            ordersn: that.data.orderNo,
            addressId: res.data.addressId
          }, (res) => {
            console.log(res)
            if (res.data.code == 200) {
              wx.navigateTo({
                url: '/page/yueMember/pages/SuccessfulReception/SuccessfulReception',
              })
            }
          }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
        } else {
          setTimeout(function() {
            const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
            const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
            if (wxPrevPage) {
              wxPrevPage.setData({
                page: 1,
              })
              wx.navigateBack()
            }
          }, 2000);
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid)

  },
  VerificationCode: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      isElite: options.isElite,
      orderNo: options.orderNo,
      mobile: wx.getStorageSync('mobile')
    })
    if (options.type == 'edit') {
      console.log(options)
      that.setData({
        receivername: options.receivername,
        mobile: options.mobile,
        address: options.address,
        addressId: options.addressId,
        isDefault: options.isDefault,
        province: options.provicename,
        city: options.cityname,
        area: options.zonename,
        Town: options.townName == 'null' ? '' : options.townName,
        provinceId: options.proviceId,
        cityId: options.cityId,
        areaId: options.zoneId,
        TownId: options.townId,
      })
    }
    that.defaultData()
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.screenHeight - 350
        })
      },
    })
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
  onShow: function() {
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
  }
})