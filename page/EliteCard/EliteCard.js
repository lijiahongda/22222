
import {
  get,
  post,
  relations,
  retrunScene
} from '../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrolly:true,
    toView:'a1',
    teamType:0,
    isSmallRedPopup: true,
    LoadingStatus: false,
    uid: '',
    token: '',
    isHaveMore: true, //是否加载更多
    cardType: 0,
    share: '', //分享使用的参数
    isSharingResults: 0,
    current_card: 0,
    indicatorDots: false,
    autoplay: false,
    page: 1,
    pageSize: 10,
    datas: '',
    authorizationStatus: false,
    mobile: '',
    codeNumber: '',
    isShareSuccess: false,
    coupon: '', //购买大礼包成功后 是否弹出优惠券
    couponFrame: false,
    GiftIndex: 0,
    up:true,
    curPage:'',
    swiper_curPage:''
  },
  //滚动轮播变换数据
  swiperBindchange(e){
    this.setData({
      swiper_curPage:e.detail.current
    })
    this.getLeval2()
    console.log(this.data.up,wx.getStorageSync('status'),'000------------')
  },
  // 展开
  up(){
    this.setData({
      iconDataList:this.data.iconData,
      up:false,
    })
    wx.setStorageSync('status', 0);
  },
  down(){
    this.setData({
      iconDataList:this.data.iconData.slice(0, 8),
      up:true,
    })
    wx.setStorageSync('status', 1);
  },
  //积分商城详情
  IntegralMallDetails: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMallDatail/IntegralMallDatail?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  // 积分商城
  IntegralMall: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/IntegralMall/IntegralMall'
    })
  },

  // 优惠券列表
  CouponMore: function() {
    wx.navigateTo({
      url: '/page/CardVolume/pages/CardVolume/CardVolume'
    })
  },
  // 白拿
  takeWithout: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/NewHotStyle/NewHotStyle?id=' + 37
    })
  },
  // 去等级
  goLevel(){
    wx.navigateTo({
      url: '/page/oneself/pages/growthRule/growthRule?growthRules='+this.data.growthRules
    })
  },
  // 前往成长值
  goGrowth(){
    console.log('////////////////////')
    wx.navigateTo({
      url: '/page/oneself/pages/growthValue/growthValue'
    })
  },
  // 手机号验证码
  VerificationCode: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  onTwoItemClick: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    that.setData({
      twoIndex: item.id
    })
    that.ActivityList(item.id)
  },
  onGifItemClick: function(e) {
    wx.setStorageSync('homeShow', false)
    let that = this
    let item = e.currentTarget.dataset.item
    let id = (item.id ? item.id : 0)
    let activityids = (item.activityIds ? item.activityIds : 0)
    that.setData({
      GiftIndex: id,
    })
    that.GiftList(id, activityids)
  },
  openMember: function() {
    console.log('ppp')
    let that = this
    that.setData({
      toView: 'a'+3
    })
    console.log(that.data.toView)
    // console.log('[[[[')
    // wx.navigateTo({
    //   url: '/page/yueMember/pages/openMember/openMember',
    // })
  },

  goodDetail: function() {

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
  toHousekeeper: function() {
    wx.navigateTo({
      url: '/page/yueMember/pages/housekeeper/housekeeper'
    })
  },
  makeMoney: function(e) {
    if (e.currentTarget.dataset.type == 5) {
      wx.navigateTo({
        url: '/page/other/pages/YueNews/YueNews',
      })
    } else if (e.currentTarget.dataset.type == 6) {
      this.setData({
        url: 'https://image.yuelvhui.com/pubfile/2019/06/03/line_1559544963.png',
        have: '#6C4E35',
        not: '#fff',
        ide: '权益'
      })
    } else {
      wx.navigateTo({
        url: '/page/oneself/pages/FunctionIntroduction/FunctionIntroduction?type=' + e.currentTarget.dataset.type + '&MyreCode=' + wx.getStorageSync('selfReCode')
      })
    }
  },
  title: function(e) {
    let val = e.currentTarget.dataset.title
    if (val == '权益') {
      this.setData({
        url: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-02-17/01/yuelvhuipwlUoKmdBK1581872643.png',
        have: '#000000',
        not: '#F0D0A5',
        ide: val,
        page: 1,
        isHaveMore: true
      })
    } else if (val == '赚钱') {
      this.setData({
        url: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-02-17/01/yuelvhuiIXz2ERe9yV1581872662.png',
        have: '#F0D0A5',
        not: '#000000',
        ide: val,
        page: 1,
        isHaveMore: true
      })
    }
    this.retypeData()
  },
  // 商品列表  
  retypeData: function() {
    let that = this
    let id = 31
    if (that.data.ide == '赚钱') {
      id = 149
    }
    that.setData({
      order: []
    })
    post('/mall/goodsList', {
      id: id,
      page: that.data.page,
      pageSize: that.data.pageSize,
      uid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : 0
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          order: res.data.data,
          backGround: res.data.backGround.url,
          openMember: res.data.backGround.title,
          isShow: res.data.isShow,
          page: that.data.page + 1
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function() {
    this.setData({
      showModalStatus: false,
      showModal: false
    })
    // 隐藏遮罩层
    this.setData({
      showModalStatus: false,
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
  ShareSuccess: function() {
    this.setData({
      isShareSuccess: false
    })
  },
  join: function(e) { //加入悦旅会
    this.setData({
      isShareSuccess: true
    })
  },
  // 滑块
  bindChange: function(e) {
    this.setData({
      current: e.detail.current,
      currentId: e.detail.current
    })
    console.log(this.data.currentId)
    if (this.data.current == 0) {
      this.postShareImg()
    } else if (this.data.current == 1) {
      // this.postShareImgAdultCard()
    }
  },
  couponList: function() {
    wx.navigateTo({
      url: '/page/CardVolume/pages/CardVolume/CardVolume',
    })
  },
  goodsActiyDetail: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid
    })
  },
  goodsDetail: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/MembershipProductDetails/MembershipProductDetails?goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid
    })
  },
  iconDetail: function(e) {
    if(wx.getStorageSync('uid')){
      let title = e.currentTarget.dataset.title
      let image = e.currentTarget.dataset.image
      let type = e.currentTarget.dataset.type
      let shareimg = e.currentTarget.dataset.shareimg
      let sharetitle = e.currentTarget.dataset.sharetitle
      let button = e.currentTarget.dataset.button
      let that = this
      // 购物省钱=1，底价酒店=2，免费游全球=3，288优惠券=4，积分商城=5，当月白拿=7，加油省钱=8，生活充值=9
      wx.navigateTo({
        url: '/page/yueMember/pages/EliteCardDetails/EliteCardDetails?title=' + title + '&iscard=' + that.data.datas.isCard + '&image=' + image + '&type=' + type + '&shareimg=' + shareimg + '&sharetitle=' + sharetitle + '&color=' + e.currentTarget.dataset.color +'&button=' + button,
      })
    }else{
      this.VerificationCode()
    }
    return
    if (type == 3) {
      wx.navigateTo({
        url: '/page/other/pages/YueNews/YueNews',
      })
    } else if (type == 2 || type == 1 || type == 4 || type == 5 || type == 8) {
      wx.navigateTo({
        url: '/page/yueMember/pages/EliteCardDetails/EliteCardDetails?title=' + title + '&iscard=' + that.data.datas.isCard + '&image=' + image + '&type=' + type + '&shareimg=' + shareimg + '&sharetitle=' + sharetitle + '&color=' + e.currentTarget.dataset.color,
      })
    } else if (type == 6) {
      //积分商城
      wx.navigateTo({
        url: '/page/Yuemall/pages/IntegralMall/IntegralMall',
      })
    } else if (type == 7) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/Free/Free',
      })
    } else if (type == 9) {
      wx.navigateTo({
        url: '/page/yueMember/pages/VideoRecharge/VideoRecharge'
      })
    } else if (type == 10) {
      wx.navigateTo({
        url: '/page/yueMember/pages/NethongVilla/NethongVilla'
      })
    }
  },
  // 分类列表
  classificationList: function(e) {
    app.classificationList(e, this)
  },
  ActivityList: function(categoryId) {
    let that = this
    post('/mall/V3/newActivityList', {
      id: 439,
      categoryId: categoryId
    }, res => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          OrdinaryList: res.data.data[0].goodsInfo
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  //banner信息
  getLeval(){
    let that = this
    post('/mall/membershipLevelList', {
      uid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : 0
    }, res => {
      if (res.data.code == 200) {
        var curPage = 0;
        for(let i = 0 ;i<res.data.data.levelList.length;i++){
          if (res.data.data.levelList[i].isCurrentLevel == '1') {
            curPage = res.data.data.levelList[i].level;
          }
        }
        that.setData({
          levelList:res.data.data.levelList,
          growthRules:res.data.data.growthRules,
          swiper_curPage:curPage-1
        })
        console.log(curPage,'99999999999999992222222222')
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    console.log(that.data.swiper_curPage,'99999999999999992222222222')

  },
  //icon list
  getLeval2(){
    let that = this
    console.log(that.data.swiper_curPage,'0000000000--------111111111122222')
    post('/mall/membershipInterests', {
      uid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : 0,
      level:that.data.swiper_curPage +1
    }, res => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          iconData:res.data.data.iconDataList,
          equityAmount:res.data.data.equityAmount
        })
        if(wx.getStorageSync('status') == 3){
          console.log('3-------')
          this.setData({
            up:true,
            iconDataList:res.data.data.iconDataList.slice(0, 8),
          })
        }else if(wx.getStorageSync('status') == 0) {
          console.log('0-------')
          this.setData({
            iconDataList:this.data.iconData,
            up:false,
          })
        }else if(wx.getStorageSync('status') == 1) {
          console.log('1-------')
          this.setData({
            iconDataList:this.data.iconData.slice(0, 8),
            up:true,
          })
        }
        setTimeout(function() {
          that.setData({
            LoadingStatus: false,
          })
        }, 2000)
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  dataDatile: function() {
    let that = this
    post('/mall/getGiftPackage', {
      mid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : 0
    }, res => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          datas: res.data.data,
          dataIcon: res.data.data.icon_data.slice(0, 8),
          progress: res.data.data.memberInfo.userGrowth * 100 / res.data.data.memberInfo.needGrowth
        })
        setTimeout(function() {
          that.setData({
            LoadingStatus: false,
          })
        }, 2000)
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    post('/mall/V3/getActivityCategoryInfo', {
      id: 439
    }, res => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          twoIndex: res.data.data.categoryInfo[0].id,
          categoryInfo: res.data.data.categoryInfo
        })
        that.ActivityList(res.data.data.categoryInfo[0].id)
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
    post('/mall/getGiftTag', {}, res => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          GiftType: res.data.data,
          GiftIndex: res.data.data[0].id
        })
        that.GiftList(res.data.data[0].id, res.data.data[0].activityIds)
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  GiftList: function(categoryId, activityIds) {
    let that = this
    post('/mall/getGiftGoods', {
      activityId: activityIds,
      categoryId: categoryId
    }, res => {
      if (res.data.code == 200) {
        console.log(res)
        if (res.data.data[0].teamType == 0) {
          console.log('[[[[[[[')
          that.setData({
            GiftList: res.data.data[0].goodsInfo,
            teamType: res.data.data[0].teamType
          })
          that.selectComponent("#listTwo")._onOption(res.data.data[1].goodsInfo, true,true)
        }else{
          that.setData({
            list: res.data.data[0].goodsInfo,
            teamType: res.data.data[0].teamType
          })
          that.selectComponent("#listTwo")._onOption(res.data.data[0].goodsInfo, true,false)
        }
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  // 跳转 开通店主
  upgrading: function() {
    wx.navigateTo({
      url: '/page/yueMember/pages/OpenEliteCard/OpenEliteCard',
    })
  },
  onUnload:function(){
    app.globalData.isSetList = false
  },
  onLoad: function(options) {
    let that = this;
    let scene = ''; //准备存扫码过来的参数
    that.setData({
      cardType: wx.getStorageSync('cardType'),
    })
    if (options.scene != null) {
      //扫码参数分解
      retrunScene(options.scene, function(sceneObj) {
        that.data.reCode = sceneObj.C;
      });
    } else if (options.reCode) {
      this.data.reCode = options.reCode;
    }
    if (this.data.reCode) { //处理分享吗
      if (wx.getStorageInfoSync('isShareSet') != 'isShareSet') {
        relations(this.data.reCode);
      }
    }
    that.setData({
      LoadingStatus: true,
    })
    if(wx.getStorageSync('uid')){
      post('/mall/membershipLevelList', {
        uid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : 0
      }, res => {
        if (res.data.code == 200) {
          console.log('---000000000===========--------')
          var curPage = '';
          for(let i = 0 ;i<res.data.data.levelList.length;i++){
            if (res.data.data.levelList[i].isCurrentLevel == '1') {
              curPage = res.data.data.levelList[i].level;
            }
          }
          console.log(curPage)
          that.setData({
            levelList:res.data.data.levelList,
            growthRules:res.data.data.growthRules,
            swiper_curPage:curPage-1
          })
          this.getLeval2()

          console.log(that.data.swiper_curPage,curPage,'666666666666666')

        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)

    }

    
    that.retypeData()
    wx.setStorageSync('status',3)
    // 用户授权后购买过卡显示登录页面   用户授权后没购过卡显示未登录页面
  },
  navTop: function() {
    let that = this
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = (menuButtonObject.top * 2) + 8, //胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        that.setData({
          navTop: navTop
        })
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  onShow: function() {

    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    var prevPage = pages[pages.length - 2]; 
    let url = currentPage.route;
    let options = currentPage.options;
    // 优惠券弹框
    // prevPage.click()
    console.log(options)
    if (app.globalData.couponBox) {
      that.setData({
        couponFrame: true
      })
    }
    wx.setStorageSync('myrequest', 'myrequest');
    console.log(options)
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      if (wx.getStorageInfoSync('isShareSet') != 'isShareSet') {
        relations(options.reCode);
      }
    }
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    
    if (wx.getStorageSync('uid')) {
      //已经登陆
      console.log('已经绑定了')
      that.setData({
        isSmallRedPopup: false,
      })
      that.dataDatile()
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
      that.dataDatile()
    }
    that.setData({
      uid: wx.getStorageSync('uid')
    })
    if (wx.getStorageSync('uid')) {
      that.postShareImg();
      if(app.globalData.isMeber == true ){
        post('/mall/membershipLevelList', {
          uid: wx.getStorageSync('uid') ? wx.getStorageSync('uid') : 0
        }, res => {
          if (res.data.code == 200) {
            var curPage = 0;
            for(let i = 0 ;i<res.data.data.levelList.length;i++){
              if (res.data.data.levelList[i].isCurrentLevel == '1') {
                curPage = res.data.data.levelList[i].level;
              }
            }
            that.setData({
              levelList:res.data.data.levelList,
              growthRules:res.data.data.growthRules,
              swiper_curPage:curPage-1
            })
            console.log(that.data.swiper_curPage,curPage,'666666666666666')
            that.getLeval2()

          }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)        
      }

    }
    console.log(that.data.windowHeight,'hllllllllllllllllllll')
    if(that.data.hhh ==700 ){
      // that.setData({
      //   toView: 'a'+2
      // })
    }
    that.navTop()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  // 关闭优惠券弹框
  closeFrame: function() {
    this.setData({
      couponFrame: false
    })
    app.globalData.couponBox = false
  },
  postShareImg: function() {
    post('/share/equityShare', {
      uid:wx.getStorageSync('uid')
    }, (res) => { // 获取分享图片 ajax
      if (res.data.code === 200) {
        this.setData({
          share: res.data.data,
        })
        console.log(res.data.data)
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync("token"), true, wx.getStorageSync("uid"),4);
  },
  // postShareImgAdultCard: function(_this) {
  //   get('/app/card/right/shareLdCard', {}, (res) => { // 获取分享图片 ajax
  //     if (res.data.code === 200) {
  //       this.setData({
  //         share: res.data.data,
  //       })
  //     } else if (res.data.code == 400) {
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon: 'none'
  //       })
  //     }
  //   }, 1, wx.getStorageSync("token"), true, wx.getStorageSync("uid"));
  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route
    var options = currentPage.options
    var value = ''
    let _this = this;
    let nickname = wx.getStorageSync('nickname');
    try {
      value = wx.getStorageSync('selfReCode')
    } catch (e) {
      // Do something when catch error
    }
    /**
     * 分享回调失效。所以成功失败都送币
     * */
    this.setData({
      isSharingResults: 1,
    })
    get('/app/index/share/' + this.data.isSharingResults + '/' + 1 + '/' + this.data.hotelId, {}, (res) => {
      if (res.data.code === 200) {
        if (res.data.coin > 0) {
          this.setData({
            showModalStatus: true, //充值弹窗状态
            showModal: true, //充值弹窗状态
          });
        } else {
          wx.showToast({
            title: '分享成功',
            icon: 'none'
          })
          // this.detailData(this)
        }

      } else {

      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));

    return {
      title: _this.data.share.desc,
      imageUrl: _this.data.share.showImg,
      path: "/page/EliteCard/EliteCard?reCode=" + value,
      complete: (res) => {
        this.setData({
          showModalStatus: 1,
        })
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    let id = 31
    // if (that.data.ide == '赚钱') {
    //   id = 149
    // }
    // if (this.data.isHaveMore) {
    //   post('/mall/goodsList', {
    //     id: id,
    //     page: that.data.page,
    //     pageSize: that.data.pageSize,
    //     uid: wx.getStorageSync('uid')
    //   }, (res) => {
    //     console.log(res)
    //     if (res.data.code == 200) {
    //       that.setData({
    //         order: that.data.order.concat(res.data.data),
    //         page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
    //         isHaveMore: res.data.data.length > 0 ? true : false
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none'
    //       })
    //     }
    //   }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    // } else {
    //   wx.showToast({
    //     title: '没有更多了！',
    //     icon: 'none'
    //   })
    // }

  },
})