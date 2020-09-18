// page/yueMember//pages/VideoRechargeDetail/VideoRechargeDetail.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js'
var app = getApp();

let touchDotY = 0; //y按下时坐标
let interval; //计时器
let time = 0; //从按下到松开共多少时间*100

Page({

  /**
   * 页面的初始数据
   */
  data: {
    enable: true,
    isvslide: false,
    orderList: [], //详细信息
    sharelayer: false,
    shareImg: '', //转发图片
    shareTitle: '', //转发文案
    mid: '',
    product_info: {}, //关联商品信息
    auth_info: {}, //发布者信息
    pages: 1,
    src: '',
    id: '', //id
    videoConFirst: true, //内容第一部分
    videoConSecond: false, //内容第二部分
    closeConSecond: true, //是否点击关闭第二部分
    start_video_id: '', //起始视频的视频pk 用于判断上下切换视频
    curId: '', //现在这个视频id
    isShare: false,
    listPage: 0,
    isSmallRedPopup: true,
    video_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, '视频相亲')
    this.data.video_id = options.video_id
    this.data.dynamicid = options.dynamicid
   
    console.log(this.data.video_id, '这里是详情id')
  },

  onShow: function () {

    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;

    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.B); //缓存视频id
        that.setData({
          video_id: sceneObj.B
        })
        relations(sceneObj.C);
        console.log(sceneObj, 'sceneObj', that.data.video_id)
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    that.setData({
      sharelayer: false,
      mid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : 0,
    })



    if (wx.getStorageSync('uid')) {
      console.log('登陆了')
      wx.showShareMenu({
        withShareTicket: true
      })
      that.setData({
        isSmallRedPopup: false
      })

    } else {
      wx.hideShareMenu()
      //没登录
      this.setData({
        LoadingStatus: false
      })
    }
    if (wx.getStorageSync('uid')) {
      if (that.data.isShare) {
        wx.setStorage({
          key: 'videoDetail',
          data: false,
        })
      }
    }

    if (wx.getStorageSync('videoDetail')) {
      that.orderList() //详情
    }

    setTimeout(function () {
      that.playEnd()
    }, 3000)
    wx.setStorageSync('isarticle', false)
    //开始播放
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play()

  },

  // 播放结束
  playEnd: function () {
    if (this.data.orderList.showGoods) {
      this.setData({
        videoConFirst: false,
        videoConSecond: true
      })
    }
  },
  // 关闭 商品详情
  closeSecond: function () {
    this.setData({
      videoConSecond: false,
      videoConFirst: true
    })
  },



  // 详情列表
  orderList: function (e) {
    let that = this
    wx.showLoading()
    let obj = {
      mid: that.data.mid, //当前登录人的MID
      page: 1
    }
    if (that.data.video_id) {
      obj.shareVideoId = that.data.video_id
    } else {
      obj.shareVideoId = 0
    }
    post("/mall/vList", obj, res => {
      if (res.data.code == 200) {
        that.setData({
          orderList: res.data.data[that.data.listPage],
          orderAll: res.data.data
        })
        that.shareArticle(res.data.data[that.data.listPage].videoId)
        console.log(that.data.listPage)
        wx.hideLoading()
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
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
        // 获取上一个视频
        if (that.data.listPage <= 0) {
          return
        }
        that.upperVideo()
      } else if ((touchDotY - touchMoveY) > 50) {
        // 获取下一个视频
        that.nextVideo()
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },


  /**
   * 
   * 上一个视频
   * 页面相关事件处理函数--监听用户下拉动作
   * 
   */
  upperVideo: function () {
    var that = this;
    console.log('上一个')
    that.setData({
      videoConFirst: true,
      videoConSecond: false
    })
    setTimeout(function () {
      that.playEnd()
    }, 3000)
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    wx.showLoading();
    that.data.listPage -= 1

    that.setData({
      orderList: that.data.orderAll[that.data.listPage]
    })

    wx.hideLoading();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 
   * 下一个视频
   * 页面上拉触底事件的处理函数
   * 
   */
  nextVideo: function () {
    let that = this;
    console.log('下一个')
    wx.showLoading({
      title: '下一视频加载中',
    })
    that.setData({
      videoConFirst: true,
      videoConSecond: false
    })
    setTimeout(function () {
      that.playEnd()
    }, 3000)
    that.data.listPage += 1

    that.setData({
      orderList: that.data.orderAll[that.data.listPage]
    })
    that.shareArticle(that.data.orderAll[that.data.listPage].videoId)
    wx.hideLoading()

    let almost = that.data.orderAll.length - that.data.listPage
    if (almost < 3) {
      that.data.pages += 1
      post("/mall/drVideoList", {
        mid: that.data.mid, //当前登录人的MID
        page: that.data.pages,
        shareVideoId: 0
      }, res => {
        if (res.data.code == 200) {
          that.setData({
            orderAll: that.data.orderAll.concat(res.data.data)
          })
          wx.hideLoading()
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    }
  },


  // 点赞
  handZan: function () {
    let that = this
    wx.showLoading()
    if (wx.getStorageSync('uid')) {
      post('/mall/handleVideo', {
        "videoId": that.data.orderList.videoId,
        "mid": wx.getStorageSync('uid'),
        "type": 1, // type== 1(点赞) type== 2(转发)
      }, res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })
          that.data.orderList.videoPraise = res.data.data.praiseNum //点赞数
          that.data.orderList.isPraised = res.data.data.isPraised //是否点赞

          that.setData({
            orderList: that.data.orderList
          })
          wx.hideLoading()
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    } else {
      that.VerificationCode()
    }
  },


  // 跳转商品详情
  goBuy: function (e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?&goodsId=' + this.data.orderList.productId + '&skuid=' + this.data.orderList.productSkuId + '&video=video'
    })
    wx.setStorageSync('videoDetail', false)
    //暂停播放
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.pause()
  },

  // 页面内分享
  onShare: function () {
    var that = this
    this.setData({
      sharelayer: true
    })
  },
  // 关闭分享
  shareLayerClosed: function () {
    this.setData({
      sharelayer: false
    })
  },
  // 海报
  goPoster: function () {
    wx.navigateTo({
      url: "/page/other/pages/poster/poster?goodsId=" + this.data.orderList.videoId + '&url=' + '/mall/forwardVideo' + '&id=' + 'video',
    })
    wx.setStorageSync('videoDetail', false)
    //暂停播放
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.pause()
  },
  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?registerType='+1
    })
  },


  //获取转发图片 文案
  shareArticle: function (id) {
    let that = this;
    var url = "/mall/wxForward"
    var obj = {
      "videoId": id,
      "mid": wx.getStorageSync('uid'),
    }

    post(url, obj, res => {
      if (res.data.code == 200) {
        that.setData({
          shareImg: res.data.data.img,
          shareTitle: res.data.data.word,
        });
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },


  // 跳转到成为大人
  Release: function () {
    wx.navigateTo({
      url: '/page/videoDetail/pages/becomeAdult/becomeAdult'
    })
    wx.setStorageSync('videoDetail', false)
    //暂停播放
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.pause()
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
    that.videoContext = wx.createVideoContext('myVideo')
    that.videoContext.pause()
    try {
      reCode = wx.getStorageSync('selfReCode')
    } catch (e) {
      // Do something when catch error
    }
    let shareUrl = "page/videoDetail/pages/detail/detail"

    console.log(options, '分享options')
    if (that.data.orderList.videoId) {
      shareUrl = shareUrl + "?video_id=" + that.data.orderList.videoId + "&reCode=" + reCode + '&registerType=' + 1
      that.setData({
        video_id: that.data.orderList.videoId
      })
    } else {
      if (!options.video_id) {
        shareUrl = shareUrl + "?video_id=" + wx.getStorageSync('reI') + "&reCode=" + reCode + '&registerType=' + 1
      } else {
        shareUrl = shareUrl + "?video_id=" + options.video_id + "&reCode=" + reCode +'&registerType='+1
      }
    }
    that.setData({
      isShare: true
    })
    console.log(shareUrl)

    return {
      title: that.data.shareTitle,
      path: shareUrl,
      imageUrl: that.data.shareImg
    }
  }
})