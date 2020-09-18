// page/liveH5/shopDetail/shopDetail.js
import { post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    shareImg:'',
    shareTitle:'',
    goodsId: '',
    skuid: '',
    uid: '',
    mobile: '',
    authorizationStatus: false, //授权按钮状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
  },
  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorageSync('isback', '1')
    console.log('关闭了')
  },
  onShow:function(){
    let that = this
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false
      })
    } else {
      that.setData({
        authorizationStatus: true
      })
    }
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;

    var optionsData = JSON.parse(options.options)
    this.setData({
      url: 'https://open.yuelvhui.com/daRenAPP_nesting_H5/page/sapp/goodsDetail/goodsDetailDev.html?product_id=' + optionsData.goodsId + '&product_sku_id=' + optionsData.skuid + '&type=ordinary&uid=' + wx.getStorageSync('uid') + '&sell_uid=' + optionsData.uid + '&isJD=0&live_id=0&reCode=' + optionsData.reCode
    })
    console.log(this.data.url)
    that.setData({
      goodsId: optionsData.goodsId,
      skuid: optionsData.skuid,
      uid: optionsData.uid
    })

    wx.login({
      success(loginRes) {
        console.log(loginRes, 'loginReloginReloginReloginReloginRe')
        wx.request({
          url: 'https://api2.yuelvhui.com/app/auth/weixin/getOpenId',
          data: {
            "code": loginRes.code,
            "mid": wx.getStorageSync('uid')
          },
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'Authorization': 'Sys 2001.1572445472000.381d2a3926cb49cb964efe1b565be95f'
          },
          success(res) {
            console.log(res)
            wx.setStorageSync('openId', res.data.openId)
          }
        })
      }
    })



    post('/website/share/yueTaoShare', {
      mid: wx.getStorageSync('uid'),
      goods_id: optionsData.goodsId,
      code_type: 'web'
    }, res => {
      console.log('00000',res)
      if (res.data.code == 200) {
        that.setData({
          shareImg: res.data.img,
          shareTitle: res.data.word,
        });
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 3)
    if (wx.getStorageSync('uid')) {

    } else {
      that.VerificationCode()
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    var reCode = ''
    // wx.setStorageSync('videoDetail', false)
    //暂停播放
    try {
      reCode = wx.getStorageSync('selfReCode')
    } catch (e) {
      // Do something when catch error
    }
    let shareUrl = "page/liveH5/shopDetail/shopDetail"
    // optionsData.goodsId + '&product_sku_id=' + optionsData.skuid + '&type=ordinary&uid=' + wx.getStorageSync('uid') + '&sell_uid=' + optionsData.uid + '&isJD=0&live_id=0&reCode=' + optionsData.reCode
    console.log(options, '分享options')
    
    shareUrl = shareUrl + "?goodsId=" + that.data.goodsId + "&reCode=" + reCode + '&uid=' + that.data.uid
   
    console.log(shareUrl)

    return {
      title: that.data.shareTitle,
      path: shareUrl,
      imageUrl: that.data.shareImg
    }
  }
})