import {
  get,
  post,
  relations
} from '../../../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    textVal:null,
    showPopup:false,
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })
  },

  bindblur(e){
    this.setData({
      textVal: e.detail.value
    })
  },

  copy: function (e) {
    let that=this
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {
            that.setData({
              showPopup: !that.data.showPopup
            })
          }
        })
      },
      complete(res) { }
    })
  },

  showPopupBind(){
    this.setData({
      showPopup: !this.data.showPopup
    })
  },

  trun() {
    if (this.data.textVal.indexOf('http') == -1){
      wx.showToast({
        title: '请输入带有http或https的有效地址',
        icon:'none'
      })
      return
    }
    let that = this,
      data = {
        urlStr: this.data.textVal
      }
    post('/community/groupRule/conversionUrl', data, (res) => {
      if (res.data.code == 200) {
        this.setData({
          content: res.data.data.content,
          showPopup: !this.data.showPopup
        })
      }else{
        wx.showToast({
          title: res.data.msg,
        })
      }
    }, 1, this.data.token, true, this.data.uid, 1)
  },
  clean(){
    this.setData({
      textVal: null
    })
  }
})