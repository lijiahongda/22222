// page/yueMember/pages/MaterialCircle/MaterialCircle.js
import { writePhotosAlbum } from '../../../../utils/util'
import {
  get,
  post,
  relations
} from '../../../../utils/util.js';
var previewOnshow; // 解决图片预览 出发onshow
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    typeId: 10004,
    currentTab: 10175,
    isHaveMore: true
  },
  // 图片点击事件
  imgYu: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    console.log(src)
    console.log(imgList)
    //图片预览
    previewOnshow = true; //解决图片预览出发onshow
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  // 下载图片
  downloadImgs(e) {
    console.log(e)
    let img = e.currentTarget.dataset.img
    var _this = this
    // 获取保存到相册权限
    writePhotosAlbum(
      function success() {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
       
        // 调用保存图片promise队列
        _this
          .queue(img)
          .then(res => {
            wx.hideLoading()
            wx.showToast({
              title: '下载完成'
            })
          })
          .catch(err => {
            wx.hideLoading()
            console.log(err)
          })
      },
      function fail() {
        wx.showToast({
          title: '您拒绝了保存到相册'
        })
      }
    )
  },
  // 队列
  queue(urls) {
    let promise = Promise.resolve()
    urls.forEach((url, index) => {
      promise = promise.then(() => {
        return this.download(url)
      })
    })
    return promise
  },
  // 下载
  download(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url,
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            var temp = res.tempFilePath
            wx.saveImageToPhotosAlbum({
              filePath: temp,
              success: function (res) {
                resolve(res)
              },
              fail: function (err) {
                reject(res)
              }
            })
          }
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },
  // 点击标题切换
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    console.log(cur)
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        page: 1,
        typeId: cur,
        isHaveMore: true
      })
    }
    this.Class()
  },
  //页面滚动监听
  onPageScroll: function(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  Class: function() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    get('/university/v3/getMaterialIndexAf/' + that.data.typeId + '/' + that.data.pageSize + '/' + that.data.page, {}, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          subTypeList: res.data.data.subTypeList,
          list: res.data.data.articleList.list,
          page: that.data.page + 1
        })
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
  onLoad: function(options) {
    let that = this;
    that.setData({
      currentTab:1004
    })
    that.Class()
  },
  // 保存相册
  savePic: function (e) {
    let that = this
    wx.downloadFile({
      url: e.currentTarget.dataset.img,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000
            })
            post('/university/v3/download', {
              aid: e.currentTarget.dataset.aid
            }, (res) => {
              if (res.data.code == 200) {
                that.setData({
                  page: 1
                })
                that.Class()
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
          },
          fail: function (res) { }
        })
      },
      fail: function () {
        wx.showToast({
          title: res.errMsg,
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
  
  },
  // 点赞
  Fabulous: function(e) {
    let that = this
    post('/university/v3/clickLike', {
      aid: e.currentTarget.dataset.aid
    }, (res) => {
      if (res.data.code == 200) {
        wx.showToast({
          title: '成功',
        })
        that.setData({
          page: 1 
        })
        that.Class()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  onReachBottom: function() {
    let that = this
    if (this.data.isHaveMore) {
      get('/university/v3/getMaterialIndexAf/' + that.data.typeId + '/' + that.data.pageSize + '/' + that.data.page, {}, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data.articleList.list),
            page: res.data.data.articleList.list.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.articleList.list.length > 0 ? true : false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  }
})