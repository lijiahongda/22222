// pages/saveImgs/index.js
import { writePhotosAlbum } from '../../../../utils/util'
Page({
   /**
    * 页面的初始数据
    */
   data: {
      list: [
         'https://image.yuelvhui.com/pubfile/2019/06/26/line_1561526588.png',
         'https://image.yuelvhui.com/pubfile/2019/06/26/line_1561541023.png',
         'https://image.yuelvhui.com/pubfile/2019/06/26/line_1561544630.png'
      ],
      loading: false
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) { 
  },
   // 下载图片
   downloadImgs() {
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
               .queue(_this.data.list)
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
              if(res.statusCode == 200){
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
   }
})