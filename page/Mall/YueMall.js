import {
  get,
  post,
  retrunScene,
  relations
} from '../../utils/util.js';
var app = getApp();
var interval 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLayer:false,
    isbackground:false,
    TouchMove:false,
    isSmallRedPopup: true,
    SmallRed: false,
    slideWidth: 30,
    height: 1000,
    slideLeft: 0, //滑块位置
    indicatorDots: false,
    LoadingStatus: false,
    time: '00:00:00',
    orderData: [],
    uid: '',
    top: 0,
    token: '',
    authorizationStatus: false,
    currentTab: 4, //预设当前项的值
    currentINdexTYpe: 0,
    currentTabLevel: 1,
    curTab: '',
    width: '20%',
    showView: true,
    showViewHeight: false,
    ArrowWidth: '10%',
    Tab: '',
    scrollId: '',
    goodsType: [],
    qualityGoods: true,
    rests: false,
    special: [],
    featureTitle: '',
    feature: [],
    order: [],
    pageSize: 10,
    orderBanner: [],
    page: 1,
    pageSizeMore: 10,
    cur: '',
    isHaveMore: false,
    quan: [],
    goodTypeId: '',
    showModal: false,
    High: [{
        name: '低到高',
        id: '1',
        sort: 1
      },
      {
        name: '高到低',
        id: '2',
        sort: 2
      }
    ],
    lowHighNum: 0,
    isNewPeople: false,
    cardType: 1,

    VerificationCode: false, //验证码弹窗
    vCode: '', //验证码
    ountDownDay: '0',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
    goodsType: [],
    autoplay: false,
    currentIndex: 0,
    sharelayer: false,
    doneLoading: true,
    isEnableScroll: true,
    twoIndex: 0, //顶部
    tworedirectType: 666,
    titleHeight: '',
    newYear: {
      url: {}
    },
    newYearHeight: 0, // 新春图高度
    iconNewYearWx: [],
    couponExpire: false,
  },
  launchApp: function(e) {
    console.log(e.detail.errMsg)
  },
  onShow: function() {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          titleHeight: res.statusBarHeight + 45,
          newYearHeight: (res.statusBarHeight * 2 + 460)
        });
      }
    })
    // this.getuserlayer(true)

    if (wx.getStorageSync('homeShow')){
      this.getuserlayer(true)
    }
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    //扫码参数分解
    if (options.scene != null) {
      console.log(options)
      retrunScene(options.scene, function(sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
        console.log(sceneObj.C)
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    wx.setStorageSync('myrequest', 'myrequest');
    that.setData({
      refusepopup: false,
      LoadingStatus: false,
      cardType: wx.getStorageSync('cardType'),
    })
    if (wx.getStorageSync('homeShow')) {
      that.setData({
        twoIndex: 0
      })
    }
    if (wx.getStorageSync('uid')) {
      console.log('登陆了')
      that.setData({
        isSmallRedPopup: false,
        nickName: wx.getStorageSync('nickname')
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
    }

    if (wx.getStorageSync('curCar') != '1') {
      console.log('----=====home', wx.getStorageSync('curCar'))
      console.log('----=====home', wx.getStorageSync('homeShow'))
      if (wx.getStorageSync('homeShow')) {
        console.log('----=====home', wx.getStorageSync('homeShow'))
        this.getOrderList()
        this.LevelList()
        this.dataList()
      }
    } else {
      let obj = {
        uid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : that.data.uid ? that.data.uid : '',
        formType: 7
      }
      // 刷新个人信息
      post('/mall/V3/indexHome', obj, (res) => {
        if (res.data.code == 200) {
          that.setData({
            memberMessage: res.data.data.memberMessage,
            cardType: res.data.data.memberState,
            newYear: res.data.data.topBanner,
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      this.setData({
        LoadingStatus: false
      })
    }

    wx.setStorageSync('isarticle', false)
    app.globalData.isSetList = true
  },

  onCouponItemClick: function(e) {
    wx.setStorageSync('homeShow', false)
    let that = this;
    let id = e.currentTarget.dataset.id;
    let cur = e.currentTarget.dataset.current;
    let state = e.currentTarget.dataset.state
    if (that.data.currentTab == cur) {
      return false;
    } else {
      that.setData({
        currentTabLevel: cur,
        page: 1,
      })
    }
    that.setData({
      intoView: 'id2'
    })
    that.handlescroll(id)
    that.Seckill(id, state)
  },

  handlescroll: function(id) {
    let that = this;
    let query = wx.createSelectorQuery(); //创建节点查询器
    query.select('#d' + id).boundingClientRect(); //选择id='#item-' + selectedId的节点，获取节点位置信息的查询请求
    query.select('#scroll-view').boundingClientRect(); //获取滑块的位置信息
    //获取滚动位置
    query.select('#scroll-view').scrollOffset(); //获取页面滑动位置的查询请求
    query.exec(function(res) {
      that.setData({
        scrollLeft: res[2].scrollLeft + res[0].left + res[0].width / 6000
      });
    });
  },
  //回到顶部
  goTop: function(e) { // 一键回到顶部
    this.setData({
      intoView: 'id1'
    })
  },
  // 关闭分享
  shareLayerClosed: function() {
    this.setData({
      sharelayer: false
    })
  },
  // 生成海报
  goPoster: function(e) {
    this.setData({
      sharelayer: false
    })
    wx.navigateTo({
      url: "/page/other/pages/poster/poster?goodsId=" + this.data.goodsId + '&url=' + '/share/MallProductForward' + '&id=' + 'goods' + '&skuid=' + this.data.skuid,
    })
  },
  eliteCard: function() {
    wx.switchTab({
      url: '/page/EliteCard/EliteCard'
    })
  },
  //slideLeft动态变化
  getleft(e) {
    var systemInfo = wx.getSystemInfoSync();
    var _totalLength = this.data.indexTypes.length * 60; //分类列表总长度
    var _ratio = 80 / _totalLength * (750 / systemInfo.windowWidth); //滚动列表长度与滑条长度比例
    var _showLength = 750 / _totalLength * 80; //当前显示红色滑条的长度(保留两位小数)
    this.setData({
      slideLeft: e.detail.scrollLeft * _ratio
    })
  },
  // 转链
  trun(){
    wx.navigateTo({
      url: '/page/community/pages/turnUrl/turnUrl',
    })
  },
  // 积分商城
  IntegralMall: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMall/IntegralMall',
    })
  },

  // 搜索下方 二级
  onTwoItemClick: function(e) {
    wx.setStorageSync('homeShow', false)
    let that = this
    let item = e.currentTarget.dataset.item
    let channelId = item.channelId
    let name = item.name
    let id = (item.id ? item.id : 0)
    let options = {
      channelId: channelId,
      id: id,
      name: name,
      page: 1
    }
    wx.pageScrollTo({
      scrollTop: 0
    })
    console.log(e, '----')
    that.setData({
      twoIndex: e.currentTarget.dataset.index,
      tworedirectType: item.redirectType,
    })
    if (that.data.tworedirectType == 666) {
      that.getOrderList()
    } else if (that.data.tworedirectType == 44) {
      that.selectComponent("#jdCom")._onOption(options)
    } else if (that.data.tworedirectType == 34) {
      that.selectComponent("#Assemble").orderData()
    } else if (that.data.tworedirectType == 71 || that.data.tworedirectType == 70) {
      that.selectComponent("#makeupFood")._onOption(options)
    } else if (that.data.tworedirectType == 39) {
      that.selectComponent("#NewHotStyle")._onOption(id)
    } else if (that.data.tworedirectType == 84) {
      that.selectComponent("#zhiboExplosiveProducts").orderData()
    }
  },
  //一二级分类接口
  LevelList: function() {
    let that = this
    post('/mall/V2/indexCategory', {
      type: that.data.currentTab
    }, (res) => {
      if (res.data.code == 200) {
        wx.hideLoading()
        that.setData({
          goodsType: res.data.goodsType,
          SecondLevel: res.data.categoryType,
          channelId: res.data.channelId
        })
        if (res.data.categoryType != '') {
          that.setData({
            currentTabLevel: res.data.categoryType[0].goodTypeId
          })
        }
        that.dataList()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 会员等级说明
  memberType: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/LevelDescription/LevelDescription',
    })
  },

  // 购卡
  payCard: function(e) {
    wx.navigateTo({
      url: '/page/other/pages/YueNews/YueNews',
    })
  },
  flashGoodsDetail: function(e) {
    wx.setStorageSync('homeShow', false)
    let state = e.currentTarget.dataset.state
    let goodid = e.currentTarget.dataset.goodid
    let activityid = e.currentTarget.dataset.activityid
    let skuid = e.currentTarget.dataset.skuid
    wx.navigateTo({
      url: '/page/Yuemall/pages/RushBuyDetail/RushBuyDetail?goodsId=' + goodid + '&activityId=' + activityid,
    })
  },
  // 分类列表
  classificationList: function(e) {
    wx.setStorageSync('homeShow', false)
    console.log(e, '----')
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        intoView: 'id2'
      })
      return
    }
    app.classificationList(e, this)
  },

  //禁止滑动  
  disMove: function() {

  },

  // 初始化数据
  getOrderList: function(uid) {
    let that = this
    that.setData({
      LoadingStatus: true
    })
    if (wx.getStorageSync('uid') == '' || wx.getStorageSync('uid') == undefined) {
      wx.setStorageSync('uid', 0)
    }
    post('/mall/V3/indexHome', {
      uid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : that.data.uid ? that.data.uid : '',
      formType: 7
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          CartTotal: res.data.data.cartTotal,
          carouselUpNew: res.data.data.newCarousel.indexAdvertise,
          topIcon: res.data.data.topNewLabel,
          tworedirectType: res.data.data.topNewLabel[0].redirectType,
          indexTypes: res.data.data.SwitchIndexWxLabel,
          memberMessage: res.data.data.memberMessage,
          carouseldown: res.data.data.newCarousel.carouseldownNew,
          saveMoney: res.data.data.saveMoney,
          cardType: res.data.data.memberState,
          random: Math.floor(Math.random() * res.data.data.saveMoney.length),
          flashGoods: res.data.data.flashGoods,
          newYear: res.data.data.topBanner,
          iconNewYearWx: res.data.data.SwitchIndexWxLabel,
          LoadingStatus: false
        })
        console.log(res.data.data.SwitchWxLabel)

        wx.setStorageSync('cardType', res.data.data.memberMessage.cardType)
        // that.selectComponent("#banner")._onOption(res.data.data.newCarousel.indexAdvertise, '#fff','702','180','20') //传banner
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    // 中间板块
    post('/mall/V2/homeActivity', {
      uid: wx.getStorageSync('uid'),
      activityId: 76
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          activitys: res.data.data
        })
        // that.selectComponent("#ActivityTemplate")._onOption(res.data.data)
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    post('/mall/V2/homeActivity', {
      uid: wx.getStorageSync('uid'),
      activityId: 75
    }, (res) => {
      if (res.data.code == 200) {
        // this.selectComponent("#ActivityTemplateBot")._onOption(res.data.data)
        console.log(res.data.data)
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    

  },
  // dataList
  dataList: function() {
    let that = this
    post('/mall/V2/flashActivity', {
      formType: 7,
      uid: that.data.uid
    }, (res) => {
      if (res.data.code == 200) {
        wx.hideLoading()
        that.setData({
          activityList: res.data.data.activity
        })
        for (let a = 0; a < res.data.data.activity.length; a++) {
          if (res.data.data.activity[a].state == 1) {
            that.setData({
              currentTabLevel: res.data.data.activity[a].activityId,
              activityindex: a
            })
            that.Seckill(res.data.data.activity[a].activityId, res.data.data.activity[a].state)
            that.handlescroll(res.data.data.activity[a].activityId)
          }
        }
        that.setData({
          LoadingStatus: false
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 秒杀列表
  Seckill: function(id, state) {
    let that = this
    post('/mall/V2/FlashGoods', {
      state: state,
      activityId: id,
      uid: that.data.uid
    }, (res) => {
      if (res.data.code == 200) {
        wx.hideLoading()
        that.setData({
          SeckillList: res.data.data
        }, () => {
          for (let a = 0; a < that.data.activityList.length; a++) {
            if (that.data.activityList[a].activityId == that.data.currentTabLevel) {
              that.setData({
                currentTabLevel: that.data.activityList[a].activityId,
                activityindex: a,
                scrollIntoView: 'd' + that.data.activityList[a].activityId
              })
            }
          }
          that.setData({
            LoadingStatus: false,
            doneLoading: false,
            isEnableScroll: true,
            TouchMove: false
          })
          if (that.data.isHaveMore) {
            that.setData({
              intoView: 'id2'
            })
          }
          wx.hideLoading()
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },

  // 搜索商品
  search: function(e) {
    wx.navigateTo({
      url: '../Yuemall/pages/search/search',
    })
  },

  // 购物车
  gocar: function() {
    wx.setStorageSync('homeShow', false)
    let that = this
    wx.navigateTo({
      url: '../Yuemall/pages/Cart/Cart',
    })
  },
  onLoad: function(options) {
    let scene = ''; //准备存扫码过来的参数
    console.log(options)
    if (options.scene != null) {
      //扫码参数分解
      retrunScene(options.scene, function(sceneObj) {
        if (sceneObj.C) { //处理分享吗
          relations(sceneObj.C);
          console.log(sceneObj.C)
        }
      });
    }
    let that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    wx.setStorage({
      key: 'curCar',
      data: '0',
    })
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      cardType: wx.getStorageSync('cardType'),
      isBinding: wx.getStorageSync('isBinding'),

    })
    if (wx.getStorageSync('uid')) {
      this.couponExpireData()
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          top: res.screenHeight * 0.65,
          topText: res.screenHeight * 0.66
        })
      },
    })
    get('/app/index/yue/share/image', {}, (res) => {
      if (res.data.code === 200) {
        that.setData({
          mallShare: res.data.data.mall
        })
      }
    }, 1, that.data.token, true, that.data.uid);
    post('/app/getUserLayerShareinfo', {
      mid: 665004,
    }, (res) => {
      console.log(res, 'zrrr')
      if (res.data.code == 200) {
        console.log(res.data.data, '3333333333')
        that.setData({
          shareInfo: res.data.data
        })
      } else {}
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
    this.getuserlayer(true)
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          platform: res.platform, // 这里会显示手机系统信息
        });
        console.log(res.platform)
      },
    })
  },
  // 用户链路
  getuserlayer: function (isLayer){
    post('/app/getUserLayer', {
      // mid: 648046,
      mid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : '',
      form: 2
    }, (res) => {
      console.log(res, 'zrrr')
      if (res.data.code == 200) {
        this.selectComponent("#userPopup")._onOption(res.data.data, this.data.codeNumber, 1)
        this.setData({
          userLayer: res.data.data,
          userLayerL:res.data.data.userLayer,
          couponid: res.data.data.couponInfo.couponid,
          isShowCapsulePosition: res.data.data.isShowCapsulePosition,
          typeH: res.data.data.capsulePositionInfo.type,
          isShowOtherPop: res.data.data.isShowOtherPop,
          buttonStatus: res.data.data.capsulePositionInfo.buttonStatus,
          completionDegree: res.data.data.capsulePositionInfo.completionDegree,
          goldEggsNumber: res.data.data.capsulePositionInfo.goldEggsNumber,
          antedate: res.data.data.capsulePositionInfo.antedate,
          end_dates: res.data.data.capsulePositionInfo.end_dates,
          nowTime:res.data.data.capsulePositionInfo.nowTime
        })
        console.log(isLayer, this.data.end_dates,this.data.nowTime)
        if (this.data.end_dates != 0 && isLayer) {
          console.log('dddddddooooodddddooo------====')
          clearInterval(interval);
          this.startTimer(this.data.end_dates - this.data.nowTime)
        }
        this.selectComponent("#redPopup")._onOption(res.data.data.isShowOtherPop)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'success'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  },
  haveRecitve:function(){
    let that = this
    post('/app/userReceiveTasks', {
      // mid: 648046,
      mid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : '',
    }, (res) => {
      console.log(res, 'zrrr')
      if (res.data.code == 200) {
        // this.getuserlayer()
        that.setData({
          typeH:res.data.data.type,
          buttonStatus: res.data.data.buttonStatus,
          completionDegree: res.data.data.completionDegree,
          goldEggsNumber: res.data.data.goldEggsNumber,
          antedate: res.data.data.antedate
        })
        wx.showToast({
          title: '领取成功',
          icon: 'none'
        })
      } else if (res.data.code == 201) { 
        console.log('0000000=======--------=======')
        this.selectComponent("#userPopup")._onOption(res.data.data, this.data.codeNumber, 3)
        that.setData({
          isShowCapsulePosition:0
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  },
  goNext:function(e){
    console.log(e)
    let urltype = e.currentTarget.dataset.urltype
    let couponid = e.currentTarget.dataset.couponid
    let userLayer = e.currentTarget.dataset.userlayer
    if (urltype == 1){
      wx.navigateTo({
        url: '/page/Yuemall/pages/newZone/newZone?couponid=' + couponid + '&userLayer=' + userLayer
      })
    }else{
      wx.navigateTo({
        url: '/page/Yuemall/pages/newZoneN/newZone?couponid=' + couponid + '&userLayer=' + userLayer
      })
    }
    
  },
  // 倒计时
  startTimer: function (totalSecond) {
    console.log(totalSecond)
    let that = this
    // 倒计时
    var totalSecond = totalSecond;
    interval = setInterval(function () {
      // 秒数
      var second = totalSecond;
      // 天位
      var dr = Math.floor((second) / 86400)
      var drStr = dr.toString();
      if (drStr.length == 1) drStr = '0' + drStr;
      // 小时位
      var hr = Math.floor((second - dr * 86400) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - dr * 86400 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - dr * 86400 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownDay: drStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.setData({
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });

      }
    }.bind(this), 1000);


  },
  // 隐藏弹窗
  hideModal: function() {
    this.setData({
      showModal: false
    })
    // 隐藏遮罩层
    this.setData({
      showModal: false,
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
 
  ShareResult: function() {
    post('/app/getUserLayerShareResult', {
      // mid: 648046,
      mid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : '',
      type: 1
    }, (res) => {
      if (res.data.code == 200) {
        console.log('00000000---------===========')
        this.selectComponent("#userPopup")._onOption(res.data.data, this.data.codeNumber,2)
      } else {}
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  },
  onShareAppMessage: function(e) {
    console.log(e, '=======================')
    let that = this
    wx.getStorage({
      key: 'uid',
      success: function(res) {
        that.setData({
          uid: res.data
        });
        wx.getStorage({
          key: 'token',
          success: function(res) {
            that.setData({
              token: res.data
            });
          }
        });
      }
    });
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route;

    var options = currentPage.options;
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')
    } catch (e) {
      // Do something when catch error
    }
    console.log(value)
    /**
     * 分享回调失效。所以成功失败都送币
     * */
    that.setData({
      isSharingResults: 1,
    })
    get('/app/index/share/' + that.data.isSharingResults + '/' + 2, {}, (res) => {
      if (res.data.code === 200) {
        if (res.data.coin > 0) {
          that.setData({
            showModal: true, //充值弹窗状态
          });
        } else {
          wx.showToast({
            title: '分享成功',
            icon: 'none'
          })
        }
      } else {

      }
    }, 1, that.data.token, true, that.data.uid);
    this.ShareResult()
    if (e.target.dataset.type == 'user') {
      return {
        path: "page/Mall/YueMall" + "?reCode=" + value,
        imageUrl: this.data.shareInfo.shareImg,
        title: this.data.shareInfo.shareTitle,
      }
    } else {
      return {
        title: wx.getStorageSync('nickname') + '邀你一起省钱购物',
        imageUrl: that.data.mallShare,
        path: "page/Mall/YueMall" + "?reCode=" + value
      }
    }

  },



  // 上拉切换秒杀时间及商品
  // bindscrolltolower: function() {
  //   let that = this
  //   that.setData({
  //     TouchMove:true
  //   })
  //   setTimeout(function() {
  //     console.log('======')
  //     that.setData({
  //       doneLoading: true,
  //       isEnableScroll: false,
  //       TouchMove:false
  //     })
  //     if (that.data.doneLoading) {
  //       if (that.data.isHaveMore) {
  //         that.setData({
  //           TouchMove: true
  //         })
  //         console.log('走数据', that.data.TouchMove)
  //         wx.showLoading({
  //           title: '加载中',
  //         })
  //         if (that.data.activityindex + 1 < that.data.activityList.length) {
  //           let state = that.data.activityList[that.data.activityindex + 1].state
  //           let id = that.data.activityList[that.data.activityindex + 1].activityId
  //           that.setData({
  //             currentTabLevel: id
  //           })
  //           that.Seckill(id, state)
  //           that.setData({
  //             isHaveMore: true,
  //           })
  //           console.log('结束')
  //         } else {
  //           that.setData({
  //             isHaveMore: false,
  //             isEnableScroll: true,
  //             TouchMove:false
  //           })
  //           wx.hideLoading()
  //         }
  //       } else {
  //         console.log('不走数据', that.data.TouchMove)
  //         that.setData({
  //           isHaveMore: true,
  //           isEnableScroll: true,
  //           TouchMove:false
  //         })
  //       }
  //     }
  //     console.log('数据????', that.data.TouchMove)
  //   }, 1000)

  // },
  // scrollview滚动监听事件
  bindscroll: function(e) {
    // if (e.detail.scrollTop > 100) {
    //   this.setData({
    //     floorstatus: true
    //   });

    // } else {
    //   this.setData({
    //     floorstatus: false
    //   });
    // }
    if (e.detail.scrollTop > 200) {
      this.setData({
        isbackground: true
      })
    } else {
      this.setData({
        isbackground: false
      })
    }
    // if (e.detail.scrollTop > this.data.height) {
    //   console.log(e.detail.scrollTop,this.data.height,'-----------')
    //   this.setData({
    //     isSeckill: true
    //   })
    // } else {
    //   console.log(e.detail.scrollTop,this.data.height,'=============')
    //   this.setData({
    //     isSeckill: false
    //   })
    // }
  },
  // 触摸屏幕收起红包
  mytouchstart: function(e) {
    console.log('触摸')
    this.setData({
      SmallRed: true
    })
  },
  // 松开屏幕出现红包
  mytouchmove: function(e) {
    console.log('松手')
    this.setData({
      SmallRed: false
    })
  },
  // 手机号验证码
  VerificationCode: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  // 跳转到优惠券列表
  goCoupon() {
    wx.navigateTo({
      url: '/page/CardVolume/pages/CardVolume/CardVolume',
    })
  },
  // 关闭过期优惠券
  couponExpireChange() {
    this.setData({
      couponExpire: false
    })
  },
  // 请求是否弹出过期优惠券
  couponExpireData() {
    let that = this
    get('/app/member/couponRxpireSoonRemind', {}, (res) => {
      if (res.data.code === 200) {
        if (res.data.data == 1) {
          that.setData({
            couponExpire: true
          })
        }
      }
    }, 1, that.data.token, true, that.data.uid);
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    if (that.data.tworedirectType == 33) { //限时半价
      wx.showLoading()
      that.selectComponent("#limited-time")._onReachBottom()
    } else if (that.data.tworedirectType == 44) { //京东
      wx.showLoading()
      that.selectComponent("#jdCom")._onReachBottom()
    } else if (this.data.tworedirectType == 34) { //拼团
      wx.showLoading()
      this.selectComponent("#Assemble")._onReachBottom()
    } else if (this.data.tworedirectType == 45) {
      wx.showLoading()
      that.selectComponent("#makeupFood")._onReachBottom()
    } else if (this.data.tworedirectType == 84) {
      that.selectComponent("#zhiboExplosiveProducts")._onReachBottom()
    }
  },
})