// page/bring//pages/enCore/enCore.js
import { get, post, wxLogin, relations } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getinfo(){
    var that=this
    post('/website/encore/download',{},res=>{
      console.log(res,'getinfo')
      if(res.data.code==200){
        that.setData({
          backgd:res.data.data,
          topurl: res.data.data.top_url
        })
      }
    }, 1, wx.getStorageSync('token'), true, that.data.mid, 3)
  },
  touchStart: function (e) {
    touchDotY = e.touches[0].clientY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  // 触摸结束事件
  touchEnd: function (e) {
    let touchMoveY = e.changedTouches[0].pageY;
    let that = this
    if (time < 20) {
      if ((touchMoveY - touchDotY) > 50) {
        that.upperVideo()
        console.log("下滑滑动=====")
      } else if ((touchDotY - touchMoveY) > 50) {
        console.log("上滑动=====")
        that.nextVideo()
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  goLive: function () {
    this.setData({
      liveListShow: !this.data.liveListShow
    })
    //暂停播放
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.pause()
  },
  goLives: function () {
    this.setData({
      liveListShow: false
    })
    //开始播放
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play()
  },
  copyurl(e){
    var that = this;
    console.log(e)
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.topurl,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
 
  },

  getrespei(e){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinfo()
    this.getrespei()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ef3e50',
    })
    this.setData({
      mid:wx.getStorageSync('uid')
    })
    this.shareImg()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  shareImg: function () {
    let that = this;

    post('/website/share/applicationAnchorShare', {
      mid: that.data.mid, //登录人MID
     
    }, res => {
      console.log(res,'resresres')
      if (res.data.code == 200) {
        that.setData({
          shareImg: res.data.data.img,
          shareTitle: res.data.data.title,
        });
      }
    }, 1, wx.getStorageSync('token'), true, that.data.mid, 3)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const reCode = wx.getStorageSync('selfReCode');//分享携带本人邀请码
    let shareUrl = "page/bring/pages/enCore/enCore?reCode=" + reCode + '&mid=' + this.data.mid + '&auth_mid=' + this.data.auth_mid
    console.log(shareUrl)
    return {
      title: this.data.shareTitle,
      path: shareUrl,
      imageUrl: this.data.shareImg
    }
  },
  headerShow: function (e) {
    previewOnshow = true; //解决图片预览出发onshow
    var src = e.currentTarget.dataset.src;//获取data-src
    let list = []
    list.push(src)
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  }
})