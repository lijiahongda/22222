import {
  get,
  post,
  relations
} from '../../../utils/util.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    showPosterImg:false,
    posterImg:''
  },

  created() {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token')
    })
    this.getData()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData() {
      let that = this
      post('/community/groupRule/invitePosterList', {}, (res) => {
        if (res.data.code == 200) {
          res.data.data.map(obj=>{
            obj.text = obj.content
            obj.content = obj.content.split('\n')
          })
          that.setData({
            list: res.data.data
          })
          console.log(this.data.list)
        }
      }, 1, this.data.token, true, this.data.uid, 1)
    },
    sharePosterImg(e){
      wx.showLoading({
        title: '海报生成中',
      })
      let that = this,
        data={
          posterImg:e.currentTarget.dataset.img
        }
      post('/community/groupRule/sharePoster', data, (res) => {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            posterImg:res.data.data,
            showPosterImg:true
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      }, 1, this.data.token, true, this.data.uid, 1)
    },
    hideImg(){
      this.setData({
        showPosterImg:false
      })
    },
    copy: function (e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
        success(res) {
          wx.getClipboardData({
            success(res) { }
          })
        },
        complete(res) { }
      })
    },
    // 长按保存图片
    saveImg(e) {
      let url = e.currentTarget.dataset.url;
      //用户需要授权
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                // 同意授权
                this.saveImg1(url);
              },
              fail: (res) => {
                console.log(res);
              }
            })
          } else {
            // 已经授权了
            this.saveImg1(url);
          }
        },
        fail: (res) => {
          console.log(res);
        }
      })
    },
    saveImg1(url) {
      wx.getImageInfo({
        src: url,
        success: (res) => {
          let path = res.path;
          wx.saveImageToPhotosAlbum({
            filePath: path,
            success: (res) => {
              console.log(res);
            },
            fail: (res) => {
              console.log(res);
            }
          })
        },
        fail: (res) => {
          console.log(res);
        }
      })
    },
  }
})
