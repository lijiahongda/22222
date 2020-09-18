// page/other/pages/poster/poster.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloadUrl: '',
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options,'海报')
    that.setData({
      id: options.id,
      isSam: options.isSam
    })
    that.download(options.goodsId, options.url, options.isSam, options.imgurl, options.skuid, options.type, options.foundid, options.islive, options.activityPrice);
    // that.download(options.goodsId, options.url,options.isSam);
  },
  download: function (id, url, isSam, imgurl, skuid, type, foundid, islive, activityPrice) { // 生成海报
    console.log(id, url, isSam, imgurl, skuid, type, foundid, islive, 'id, url, isSam, imgurl, skuid, type, foundid','islive')
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    console.log(url)
    if (islive==1){
      post(url, {
        goods_id: id,
        mid: wx.getStorageSync('uid')
      }, (res) => {
        if (res.data.code == 200) {
          _this.setData({
            downloadUrl: res.data.img,
            isShow: true
          })
          wx.hideLoading()
        } else { }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 3)
    }else{
      if (_this.data.id == 'lin') {

        url = url + id + '/' + wx.getStorageSync('uid')

        get(url, {}, (res) => {
          if (res.data.code == 200) {
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else {

          }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 2);
      } else if (_this.data.id == 'video') {
        url = url
        post(url, {
          videoId: id,
          mid: wx.getStorageSync('uid'),
          codeType: "web"
        }, (res) => {
          if (res.data.code == 200) {
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else { }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
      } else if (_this.data.id == 'goods') {
        url = url
        post(url, {
          product_id: id,
          product_sku_id: skuid,
          activityPrice: activityPrice,
          uid: wx.getStorageSync('uid')
        }, (res) => {
          if (res.data.code == 200) {
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else {}
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)

      } else if (_this.data.id == 'Assemblegoods') {
        get(url + '?product_id=' + id + '&type=' + 'ylh' + '&uid=' + wx.getStorageSync('uid') + '&product_sku_id=' + skuid, {}, (res) => {
          if (res.data.code == 200) {
            console.log(res)
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else {}
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
      } else if (_this.data.id == 'Bargaingoods') {
        get(url + '?product_id=' + id + '&type=' +'ylh' + '&uid=' + wx.getStorageSync('uid') + '&product_sku_id=' + skuid, {}, (res) => {
          if (res.data.code == 200) {
            console.log(res)
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else {}
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
      } else if (_this.data.id == 'BargaingoodsDetail') {
        get(url + '?product_id=' + id  + '&uid=' + wx.getStorageSync('uid') + '&product_sku_id=' + skuid + '&found_id=' + foundid, {}, (res) => {
          if (res.data.code == 200) {
            console.log(res)
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else {}
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
      } else if (_this.data.id == 'half'){
        get(url + '?activityId=' + skuid + '&uid=' + wx.getStorageSync('uid') + '&goodsId=' + id, {}, (res) => {
          if (res.data.code == 200) {
            console.log(res)
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else { }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
      } else if (_this.data.id == 'Interal'){
        get(url + '?uid=' + wx.getStorageSync('uid')  + '&id=' + id, {}, (res) => {
          if (res.data.code == 200) {
            console.log(res)
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else { }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
      } else if (_this.data.id == 'MembershipProductDetails'){
        post(url, {
          product_id: id,
          product_sku_id: skuid,
          uid: wx.getStorageSync('uid')
        }, (res) => {
          if (res.data.code == 200) {
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else { }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
      } else if (_this.data.id == 'jifen') {
        post(url, {
          id: id,
          uid: wx.getStorageSync('uid')
        }, (res) => {
          if (res.data.code == 200) {
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else { }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
      } else if (_this.data.id == 'mustBuy') {
        post(url, {
          uid:wx.getStorageSync('uid'),
          shareType:7 ,
          activityId:id 
        }, (res) => {
          if (res.data.code == 200) {
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else { }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      }else{
        if (_this.data.id == 'hotel') {
          if (isSam == '1') {
            url = url + '?hotelId=' + id + '&mid=' + wx.getStorageSync('uid') + '&isSam=' + 1
          } else {
            url = url + '?hotelId=' + id + '&mid=' + wx.getStorageSync('uid')
          }

        }
        if (_this.data.id == 'rellease') {
          if (imgurl == -1) {
            url = url + wx.getStorageSync('uid') + '/' + id;
          } else {
            url = url + wx.getStorageSync('uid') + '/' + id + '/' + imgurl;
          }

        }
        get(url, {}, (res) => {
          if (res.data.code == 200) {
            _this.setData({
              downloadUrl: res.data.img,
              isShow: true
            })
            wx.hideLoading()
          } else {}
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
      }
    }
    
    

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

  },
  savePic: function() {
    wx.downloadFile({
      url: this.data.downloadUrl,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail: function(res) {}
        })
      },
      fail: function() {
        wx.showToast({
          title: res.errMsg,
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
  }
})