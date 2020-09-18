// page/Yuemall/pages/InvitationGifts/InvitationGifts.js
import {
  get,
  post,
  retrunScene,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharelayer: false,
    authorizationStatus: true,
    modelStatus: false,
    page: 1,
    scrollH: 0,
    loadMore: true,
    data:[1,2,3,4]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  onShow() {
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    let activityId = 1
    let codeNumber = ''
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        relations(sceneObj.C);
        activityId = sceneObj.D
      });
    } else if (options.codeNumber) {
      relations(options.codeNumber);
      codeNumber = options.codeNumber;
      activityId = options.activityId
    }
    console.log(codeNumber, activityId)
    this.setData({
      codeNumber: codeNumber,
      activityId: activityId,
      token: wx.getStorageSync('token')
    })
    if (wx.getStorageSync('uid')) {
      this.setData({
        authorizationStatus: false
      })
      wx.showShareMenu({
        withShareTicket: true
      })
      this.getDetailData()
      this.getShare()
      this.getShareHb()
    } else {
      console.log('0000')
      wx.hideShareMenu()
    }
  },
  rule() {
    this.setData({
      modelStatus: true
    })

  },
  hiderule() {
    this.setData({
      modelStatus: false
    })
  },
  
  loadInformations() {
    var that = this
    that.setData({
      loadMore: false,
    })
    post('/coupon/voucher/invitByPage', {
      uid: wx.getStorageSync('uid'),
      pageSize: 10,
      page: that.data.page +1,
      activityId: that.data.activityId,
      pageSize: that.data.pageSize
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          loadMore: true,
          recordData: that.data.recordData.concat(res.data.data),
          page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page
        })
      }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },

  getShare() {
    console.log('88888888888')
    let that = this,
      data = {
        uid: wx.getStorageSync('uid'),
        activityId: that.data.activityId,
        type: 2,
      }
    post('/coupon/voucher/share', data, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          urlImg: res.data.data.image,
          path: res.data.data.path,
          title: res.data.data.title,
          desc: res.data.data.desc,
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },
  getShareHb() {
    console.log('88888888888')
    let that = this,
      data = {
        uid: wx.getStorageSync('uid'),
        activityId: that.data.activityId,
        type: 3,
      }
    post('/coupon/voucher/share', data, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          urlHb: res.data.data.img,
        })
        console.log(this.data.urlHb)
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },
  // 保存图片
  saveImage: function() {
    let that = this
    console.log(that.data.urlHb)
    wx.downloadFile({
      url: that.data.urlHb,
      success: function(res) {
        var benUrl = res.tempFilePath;
        //图片保存到本地相册
        wx.saveImageToPhotosAlbum({
          filePath: benUrl,
          //授权成功，保存图片
          success: function(data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          //授权失败
          fail: function(err) {
            if (err.errMsg) { //重新授权弹框确认
              wx.showModal({
                title: '提示',
                content: '您好,请先授权，在保存此图片。',
                showCancel: false,
                success(res) {
                  if (res.confirm) { //重新授权弹框用户点击了确定
                    wx.openSetting({ //进入小程序授权设置页面
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) { //用户打开了保存图片授权开关
                          wx.saveImageToPhotosAlbum({
                            filePath: benUrl,
                            success: function(data) {
                              wx.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000
                              })
                            },
                          })
                        } else { //用户未打开保存图片到相册的授权开关
                          wx.showModal({
                            title: '温馨提示',
                            content: '授权失败，请稍后重新获取',
                            showCancel: false,
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  getDetailData() {
    let that = this,
      data = {
        type: 3,
        // codeNumber:'F44504976',
        codeNumber: that.data.codeNumber ? that.data.codeNumber : '',
        uid: wx.getStorageSync('uid'),
        // uid: 635485	,
        pageSize: 10,
        activityId: that.data.activityId,
      }
    post('/coupon/voucher/indexInfo', data, (res) => {
      console.log(res,'res')
      if (res.data.code == 200) {
        that.setData({
          couponAllData: res.data.data.couponAllData,
          indexInfo: res.data.data.indexInfo,
          recordData: res.data.data.recordData,
          reluData: res.data.data.reluData
        })
        console.log(res.data.data.couponAllData,'弹窗数据')
        if (res.data.data.couponAllData != '') {
          that.setData({
            disMove: true
          })
          that.selectComponent("#popup").onOption(res.data.data.couponAllData)

        }else{
          that.setData({
            disMove: false
          })
        }
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },


  // 手机号验证码
  VerificationCode: function() {
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber=' + that.data.codeNumber
    })
  },



  // 打开分享
  shareBox: function() {
    let that = this
    if (wx.getStorageSync('uid')) {
      that.setData({
        sharelayer: true
      })
    }
  },
  // 关闭分享
  shareLayerClosed: function() {
    this.setData({
      sharelayer: false
    })
  },

  onShareAppMessage: function() {
    let that = this
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {

    }
    let url = "page/Yuemall/pages/InvitationGifts/InvitationGifts" + "?codeNumber=" + value + '&uid=' + wx.getStorageSync('uid') + '&activityId=' + that.data.activityId
    console.log(url)
    return {
      title: that.data.title,
      imageUrl: that.data.urlImg,
      path: that.data.path,
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  }
})