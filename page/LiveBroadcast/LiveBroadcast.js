// pages/bring/bring.js
var app = getApp();
let animationShowHeight = 300;
import {
  get,
  post,
  wxLogin,
  retrunScene,
  relations,
  encrypt
} from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Noticepage: 1,
    banner: [],
    clname: 'sortvid',
    start: 1,
    limit: 10,
    listdata: [],
    type: 2,
    isload:true,
    emptyVideo:{show:false}, // 直播列表为空的时候
    
  },
  // 回放列表
  playbackList: function(e) {
   
    console.log(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/page/other/pages/playbackList/playbackList?roomId=' + e.currentTarget.dataset.item.roomid + '&roomImg=' + e.currentTarget.dataset.item.cover_img + '&title=' + e.currentTarget.dataset.item.name
    })
  
  },
  // 直播列表 滑动到右边
  bindscrolltolower: function() {
    // let that = this
    // that.data.PageNum += 1
    // post("/website/LiveVideo/get_room_list", {
    //   mid: that.data.mid, //当前登录人的MID
    //   PageNum: that.data.PageNum
    // }, res => {
    //   if (res.data.code == 200) {
    //     if (res.data.data.length) {
    //       that.setData({
    //         liveList: that.data.liveList.concat(res.data.data)
    //       })
    //     } else {
    //       wx.showToast({
    //         icon:'none',
    //         title: '暂无更多',
    //       })
    //     }
    //     wx.hideLoading()
    //   }
    // }, 1, wx.getStorageSync('token'), true, that.data.mid, 3)
  },
  NoticeDetail: function(e) {
    wx.navigateTo({
      url: '/page/other/pages/LiveNotice/LiveNotice?actId=' + e.currentTarget.dataset.item.actId
    })
  },
  Notice: function() {
    let that = this
    wx.showLoading({
      title: '加载中'
    })
    post('/yuelvhui/takeGoods/getProductList', {
      mid: wx.getStorageSync('uid'),
      type: 1,
      page: that.data.Noticepage,
      pageSize: 10
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading()
        console.log(res)
        for (var t = 0; t < res.data.data.length; t++) {
          if (res.data.data[t].type == 1) {
            that.data.listdata.unshift(res.data.data[t])
          }
        }
        that.setData({
          listdata: that.data.listdata,
          isload:false
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 3);
  },
  initData: function(type) {
    let that = this
    get('/app/LiveVideo/live?start=' + that.data.start + '&limit=' + that.data.limit + '&type=' + type, {}, (res) => {
      console.log(res)
      wx.stopPullDownRefresh()
      if (res.data.code == 200) {
        console.log(res.data.data.data)
        if (res.data.data.data.length != 0) {
          console.log('===')
          console.log(that.data.clname == 'sortvid', that.data.start , res.data.data.data[0].sign == 'mp4','111')
          if (res.data.data.data[0].sign == 'mp4'){ // 该类型为 默认的视频数据
            that.setData({
              start: that.data.start + 1,
              isload: false
            })
          }else{
            that.setData({
              listdata: res.data.data.data,
              start: that.data.start + 1
            })
            if (that.data.clname != 'huifang') {
              that.setData({
                roomInfo: res.data.data.data,
                isload: false
              })
            }
          }
          
          // 直播，无商品时播放视频
          console.log(that.data.clname == 'sortvid' , that.data.start == 2 , res.data.data.data[0].sign=='mp4')
          if (that.data.clname == 'sortvid' && that.data.start == 2 && res.data.data.data[0].sign=='mp4'){
            that.setData({
              emptyVideo:{
                url: res.data.data.data[0].cover_img,
                show:true
              }
            })
          }else{
            that.setData({
              emptyVideo: {
                show: false
              }
            })
          }
        } else {
          that.setData({
            type: 1,
            isload: false
          })
          console.log('---')
          if (that.data.clname != 'huifang') {
            // that.Notice()
          }
        }
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 3);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.getbanner()
    that.getgoods()
    that.shareImg()
    that.initData(1)
    let customParams = { path: 'pages/index/index', pid: 1 } // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节
    that.setData({
      // roomId: e.currentTarget.dataset.item.roomid,
      customParams: encodeURIComponent(JSON.stringify(customParams))
    })
  },
  // 预约返场
  encore: function() {
    wx.navigateTo({
      url: '/page/bring/pages/giveEncore/giveEncore',
    })
  },
  sortvid: function(e) {
    let {
      clname,
      type
    } = e.currentTarget.dataset
    this.setData({
      clname: clname,
      type: type,
      page: 1,
      start: 1,
      listdata: []
    })
    if (type == 5) {
      this.getProductlist(3)
    } else if (type == 4) {
      this.getProductlist(2)
    }else if (type == 2) {
      this.initData(1)
    } else if (type == 3) {
      this.initData(2)
    }
  },
  getProductlist: function(type) {
    let that = this
    wx.showLoading();
    that.setData({
      page: 1
    })
    var url = '/yuelvhui/takeGoods/getContentList'
    var obj = {
      type: type,
      page: that.data.page,
      pageSize: that.data.pageSize
    }

    post(url, obj, res => {
      wx.hideLoading();

      if (res.data.code == 200) {
        that.setData({
          listdata: res.data.data,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    }, 1, wx.getStorageSync('token'), true, that.data.mid, 3)
  },
  onTapclier: function(e) {
    let {
      goodsid,
      skuid
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?parentTypeId=' + '&goodsId=' + goodsid + '&skuid=' + skuid
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  gobanner(e) {
    app.classificationList(e, this)
  },
  // 获取banner图-删除
  // getbanner() {
  //   var that = this
  //   post('/website/takeGoods/getBanner', {}, res => {
  //     if (res.data.code == 200) {
  //       that.setData({
  //         banner: res.data.data
  //       })
  //     }
  //   }, 1, wx.getStorageSync('token'), true, that.data.mid, 3)
  // },
  goDetail: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/page/videoDetail/pages/detail/detail?video_id=' + item.videoId
    })

  },
  Liveroom:function(e){
    wx.navigateTo({
      url: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + e.currentTarget.dataset.roomid 
    })
  },
  // 获取banner
  getbanner() {
    var that = this
    post('/yuelvhui/takeGoods/getHeaderData', {type:2}, res => {
      if (res.data.code == 200) {
        that.setData({
          banner: res.data.data.notice
        })
      }
    }, 1, wx.getStorageSync('token'), true, that.data.mid, 3)
  },
  // 获取商品  website / takeGoods / getGoods
  getgoods() {
    var that = this
    post('/yuelvhui/takeGoods/RecommendYueTaoGuide', { }, res => {
      if (res.data.code == 200) {
    that.setData({
      goods: res.data.data
    })
  }
    }, 1, wx.getStorageSync('token'), true, that.data.mid, 3)
  },

  anchortj() {
    wx.navigateTo({
      url: '/page/other/pages/enCore/enCore'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    wx.getSystemInfo({
      success: function(res) {
        animationShowHeight = res.windowHeight;
      }
    })
    that.setData({
      mid: wx.getStorageSync('uid')
    })
   
    let options = currentPage.options;
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    if (that.data.isload){}else{
      if (that.data.type == 4 || that.data.type == 5) { //短视频,导购
        that.data.page += 1
        wx.showLoading({
          title: '努力加载中',
        })
        var url = '/yuelvhui/takeGoods/getContentList'
        var obj = {
          type: Number(that.data.type)-2,
          page: that.data.page,
          pageSize: 10
        }
        post(url, obj, res => {
          wx.hideLoading();
          if (res.data.code == 200) {
            if (res.data.data.length) {
              that.setData({
                listdata: that.data.listdata.concat(res.data.data)
              })
            } else {
              wx.showToast({
                title: '没有更多了！',
                icon: 'none'
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 1, wx.getStorageSync('token'), true, that.data.mid, 3)
      } else if (that.data.type == 2 || that.data.type == 3) { //直播
        let type = 1
        wx.showLoading({
          title: '努力加载中',
        })
        if (that.data.type == 2) {
          type = 1
        } else {
          type = 2
        }
        get('/app/LiveVideo/live?start=' + that.data.start + '&limit=' + that.data.limit + '&type=' + type, {}, (res) => {
          if (res.data.code == 200) {
            console.log(res)
            wx.hideLoading();
            if (res.data.data.data.length != 0 && res.data.data.data[0].sign!='mp4') {
              console.log('---')
              that.setData({
                listdata: that.data.listdata.concat(res.data.data.data),
                start: (that.data.start+1)
              })
            } else {
              wx.showToast({
                title: '没有更多了！',
                icon: 'none'
              })
            }
          }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 3);
      }
    }
    
  },
  // 上啦刷新
  onPullDownRefresh(){
    this.setData({
      clname:'sortvid',
      type:2,
      start:1,
      listdata:[]
    })
    this.getbanner()
    this.getgoods()
    this.shareImg()
    this.initData(1)
  },
  //分享图片获取
  shareImg: function() {
    let that = this;
    post('/website/share/goodsShare', {
      mid: that.data.mid
    }, res => {
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
  onShareAppMessage: function(res) {
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    const reCode = wx.getStorageSync('selfReCode'); //分享携带本人邀请码
    let shareUrl = "page/LiveBroadcast/LiveBroadcast?reCode=" + reCode
    console.log(shareUrl)
    return {
      title: this.data.shareTitle,
      path: shareUrl,
      imageUrl: this.data.shareImg
    }
  }
})