// page/other/pages/CommoditySharing/CommoditySharing.js
import {
  get,
  post,
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: [],
    yesImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-02-26/21/yuelvhuiiNMToTSNzY1582722517.png',
    noImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-02-26/21/yuelvhui2BYCqBzzlG1582722540.png',
    goodsid: 7651925
  },
  shareImageinit: function(img) {
    let that = this
    let type = 0
    if (that.data.Entrance == 'jd') {
      type = 1
    }
    post('/share/pddCouponShare', {
      img: img,
      amount: that.data.amount,
      price: that.data.price,
      goodsName: that.data.goodsName,
      vipPrice: that.data.vipPrice,
      goodsId: that.data.goodsid,
      saleCount: that.data.saleCount,
      type: type
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)

        that.setData({
          shareImageinit: res.data.img
        })

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4);
  },
  // 复制
  copy: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {}
        })
      },
      complete(res) {}
    })
  },
  // 选择图片
  clickImage: function(e) {
    let that = this
    let image = that.data.image
    let {
      index,
      shareimage
    } = e.currentTarget.dataset
    for (var i = 0; i < image.length; i++) {
      console.log('e.currentTarget.dataset')
      if (index == i) {
        image[i].ischeck = !image[i].ischeck
        that.setData({
          shareImage: shareimage
        })
      } else {
        image[i].ischeck = false
      }
      that.setData({
        image: image
      })
    }
    if (that.data.Entrance != 'wph') {
      console.log('===')
      that.shareImageinit(shareimage)
    } else {
      that.setData({
        shareImageinit: shareimage
      })
    }
    that.posterJd(that.data.goodsid, wx.getStorageSync('uid'), shareimage)
  },
  // 默认分享数据
  dataInit: function(goodsid, uid, url, bannerItem) {
    let that = this
    post(url, {
      goods_id: goodsid,
      uid: uid,
      type: 3
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        let goods_imge = res.data.data.goods_imge ? res.data.data.goods_imge : bannerItem
        console.log(goods_imge)
        let image = that.data.image
        for (var i = 0; i < goods_imge.length; i++) {
          image[i] = {
            ischeck: i == 0 ? true : false,
            img: goods_imge[i]
          }
        }
        if (that.data.Entrance != 'wph') {
          that.shareImageinit(image[0].img)
        }
        if (that.data.Entrance == 'wph') {
          that.setData({
            shareImageinit: image[0].img
          })
        }
        that.setData({
          image: image,
          good_info: res.data.data.good_info,
          shareImage: image[0].img,
          poster: image[0].img
        })
        console.log(image[0].img)
        that.posterJd(goodsid, uid, image[0].img)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4);
  },
  // 分享海报
  posterJd: function(goodsid, uid, pic) {
    let that = this
    let url = '/outside/jdGoodsShare'
    if (that.data.Entrance == 'pdd') {
      url = '/outside/pddGoodsShare'
    } else if (that.data.Entrance == 'wph') {
      url = '/outside/wph/getWphPoster'
    }
    post(url, {
      goods_id: goodsid,
      uid: uid,
      type: 2,
      pic: pic
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          poster: res.data.data.img
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4);

  },
  // 保存图片
  saveImage: function() {
    let that = this
    console.log(that.data.poster)
    wx.downloadFile({
      url: that.data.poster,
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
  onShareAppMessage: function() {
    let that = this
    let url = "page/Yuemall/pages/pddDetails/details" + "?reCode=" + wx.getStorageSync('selfReCode') + "&goodsId=" + that.data.goodsid + '&Entrance=' + 'pdd'
    if (that.data.Entrance == 'jd') {
      url = 'page/Yuemall/pages/JDUnionDetail/JDUnionDetail?goods_id=' + that.data.goodsid + '&reCode=' + wx.getStorageSync('selfReCode') + '&Entrance=' + 'jd'
    }
    if (that.data.Entrance == 'wph') {
      url = 'page/Yuemall/pages/wphDetail/wphDetail?goods_id=' + that.data.goodsid + '&reCode=' + wx.getStorageSync('selfReCode') + '&Entrance=' + 'wph'
    }
    console.log(url)
    return {
      title: this.data.good_info.goods_name,
      imageUrl: this.data.shareImageinit,
      path: url
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let url = '/outside/jdGoodsShareData'
    that.setData({
      Entrance: options.Entrance,
      goodsid: options.goodsid,
      amount: options.amount,
      price: options.price,
      goodsName: options.goodsName,
      vipPrice: options.vipPrice,
      saleCount: options.saleCount
    })
    console.log(options.bannerItem)
    if (options.Entrance == 'pdd') {
      url = '/outside/pddGoodsShareData'
      that.setData({
        bannerItem: JSON.parse(options.bannerItem)
      })
    } else if (options.Entrance == 'wph') {
      url = '/outside/wph/getShareData'
    }
    that.dataInit(options.goodsid, wx.getStorageSync('uid'), url, that.data.bannerItem)
  }
})