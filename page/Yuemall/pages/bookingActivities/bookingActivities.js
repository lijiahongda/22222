import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rulesShow:false,
    confirmSiteShow: false // 显示收货地址弹窗
  },
  // 显示收货弹窗
  confirmSite() {
    this.setData({
      confirmSiteShow: true,
      confirmSiteType: 1
    })
  },
  // 添加地址
  addressAdministration: function () {
    wx.navigateTo({
      url: '../addressAdministration/addressAdministration?Mywinning=' + 'datilAss',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token:wx.getStorageSync('token'),
      uid:wx.getStorageSync('uid'),
      reCode: options.reCode
    })
    this.likeData()
    this.getData()
    this.getShare()
  },
  getData(){
    let that = this
    get('/mall/freeActList?activityId=1179&mid=' + wx.getStorageSync('uid'), {}, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          actInfo: res.data.data.actInfo,
          goodsList: res.data.data.goodsList,
        })
        let timestamp = Date.parse(new Date());
        console.log(timestamp)
        console.log(this.data.actInfo.startTime - Number(timestamp.toString().substring(0, 10)))
        that.startTimer(this.data.actInfo.startTime - Number(timestamp.toString().substring(0,10)) )
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },

  // 去详情
  goDetails(e){
    let that=this
    wx.navigateTo({
      url: '/page/Yuemall/pages/bookingDetails/bookingDetails?goodsId=' + e.currentTarget.dataset.item.goodId + '&activityExtId=' + e.currentTarget.dataset.item.activityExtId + '&state=' + that.data.actInfo.status + '&reCode=' + that.data.reCode,
    })
  },
  rulesChange(){
    this.setData({
      rulesShow: !this.data.rulesShow
    })
  },
  // 预约活动
  booking(e){
    console.log(e)
    let that = this
    if (!that.data.address){
      that.address()
      return
    }
    console.log(that.data.address)
    that.setData({
      data: e.currentTarget.dataset.item
    })
    that.confirmSite()
  },
  sure(e) {
    // console.log(e)

    let that = this
    if (!that.data.address) {
      that.address()
      return
    }
    that.setData({
      data: e.currentTarget.dataset.item
    })
    console.log(that.data.address)
    let data = {
      mid: wx.getStorageSync('uid'), //用户id
      goodId: that.data.data.goodId, //商品id
      productSkuId: that.data.data.productSkuId, //商品skuid
      activityId: that.data.data.activityId, //活动id
      activityExtId: that.data.data.activityExtId, //活动扩展id
      addressId: that.data.address.addressId, //收货地址id
      reCode: that.data.reCode, //用户邀请码 （选填，分享时带的参数）
    }
    post('/mall/freeActReserve', data, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        that.setData({
          confirmSiteShow: false,
        })
        that.getData()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  likeData(){
    let that=this
    post('/mall/V2/getAboutFlashSale', {}, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          goodinfo: res.data.data.goodinfo
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  details: function (e) {
    let {
      activityid,
      skuid,
      goodsid
    } = e.currentTarget.dataset
    console.log(e.currentTarget.dataset)
    if (activityid) {

    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/details/details?goodsId=' + goodsid + '&skuid=' + skuid,
      })
    }
  },

  // 切换地址
  address: function () {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/addressAdministration/addressAdministration?Mywinning=' + 'datilAss',
      })
    }
     else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
      })
    }
  },

  // 倒计时
  startTimer: function (totalSecond) {
    console.log(totalSecond)
    let that = this
    // 倒计时
    var totalSecond = totalSecond;
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;

      // 小时位
      var hr = Math.floor((second) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });

      }
    }.bind(this), 1000);
  },
  
  getShare() {
    let that = this
    post('/share/freeActShareXcx', {
      activityId: 1179 ,//活动id
      mid: wx.getStorageSync('uid')  //用户id
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          title: res.data.title,
          posterUrl: res.data.posterUrl,
          showImg: res.data.showImg,
          reCode: res.data.reCode,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  // 前往订单详情
  goOrder() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/NeworderList/NeworderList?cur=0',
    })
  },
  onShow() {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    console.log()
    // this.initSelected(this.data.colorSize, '100000942707')
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
        that.setData({
          codeNumber: sceneObj.C
        })
      });
    } else if (options.reCode) {
      relations(options.reCode);
      that.setData({
        codeNumber: options.reCode
      })
    }

    if (wx.getStorageSync('uid')) {
      this.getData()
    } else {
      // this.VerificationCode()
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    console.log()
    return {
      title: that.data.title,
      path: that.data.posterUrl,
      imageUrl: that.data.showImg,
      // path: '/page/Yuemall/pages/bookingActivities/bookingActivities?reCode=' + wx.getStorageSync('selfReCode')
    }
  } 
})