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
    isShare:false,
    listPage: 0,
    isSmallRedPopup: true,
    pk:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      pk:options.id
    })
  },

  onShow: function() {

    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;

    //扫码参数分解
    // -------------
    if (options.scene != null) {
      console.log(options.scene,'==')
      retrunScene(options.scene, function(sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        that.setData({
          pk: sceneObj.I
        })
        relations(sceneObj.C);
        console.log(sceneObj, 'sceneObj', that.data.pk)
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

    setTimeout(function() {
      that.playEnd()
    }, 3000)
    wx.setStorageSync('isarticle', false)
    //开始播放
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play()

    wx.setStorageSync('christmas', false)
  },

  // 播放结束
  playEnd: function() {
    if (this.data.orderList.showGoods) {
      this.setData({
        videoConFirst: false,
        videoConSecond: true
      })
    }
  },
  // 关闭 商品详情
  closeSecond: function() {
    this.setData({
      videoConSecond: false,
      videoConFirst: true
    })
  },



  // 详情列表
  orderList: function(e) {
    let that = this
    wx.showLoading()
    post("/website/video/GetVideoDetails", {
      mid: wx.getStorageSync('uid'), //当前登录人的MID
      pk: that.data.pk
    }, res => {
      if (res.data.code == 200) {
        if (res.data.data.PlayURL){
          that.setData({
            orderList: res.data.data,
            auth_info: res.data.data.auth_info
          })
          that.shareArticle()
          wx.hideLoading()
        }else{
          wx.showToast({
            title: '该视频已下架',
            icon:'none',
            duration:2000,
            success:function(){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1,
                })
              },2000)
            }
          })
        }
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 3)
  },



  // 点赞
  handZan: function() {
    let that = this
    wx.showLoading()
    if (wx.getStorageSync('uid')) {
      post('/mall/handleVideo', {
        "videoId": that.data.pk,
        "mid": wx.getStorageSync('uid'),
        "type": 1, // type== 1(点赞) type== 2(转发)
      }, res => {
        if (res.data.code == 200) {
          if (that.data.orderList.is_zan){
            that.data.orderList.zan_num-=1
            that.data.orderList.is_zan = 0
          }else{
            that.data.orderList.zan_num += 1
            that.data.orderList.is_zan = 1
          }
          that.setData({
            orderList: that.data.orderList
          })
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })
          wx.hideLoading()
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    } else {
      that.VerificationCode()
    }
  },


  // 跳转商品详情
  goBuy: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?&goodsId=' + this.data.orderList.productId + '&skuid=' + this.data.orderList.productSkuId + '&video=video'
    })
    wx.setStorageSync('videoDetail', false)
    //暂停播放
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.pause()
  },

  // 页面内分享
  onShare: function() {
    var that = this
    this.setData({
      sharelayer: true
    })
  },
  // 关闭分享
  shareLayerClosed: function() {
    this.setData({
      sharelayer: false
    })
  },

  // 手机号验证码
  VerificationCode: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },


  //获取转发图片 文案
  shareArticle: function() {
    let that = this;
    var url = "/mall/wxForward"
    var obj = {
      "videoId": that.data.pk,
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


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
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
    let shareUrl = "page/videoDetail/pages/detaiChristmas/detaiChristmas"

    console.log(options, '分享options')
    if (that.data.pk) {
      shareUrl = shareUrl + "?id=" + that.data.pk + "&reCode=" + reCode
      that.setData({
        id: that.data.pk
      })
    } else {
      if (!options.id) {
        shareUrl = shareUrl + "?id=" + wx.getStorageSync('reI') + "&reCode=" + reCode;
      } else {
        shareUrl = shareUrl + "?id=" + options.id + "&reCode=" + reCode
      }
    }
    that.setData({
      isShare:true
    })
    console.log(shareUrl)

    return {
      title: that.data.shareTitle,
      path: shareUrl,
      imageUrl: that.data.shareImg
    }
  }
})