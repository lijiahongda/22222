//app.js
let livePlayer = requirePlugin('live-player-plugin')
App({
  onLaunch: function (options) {
    let that = this

    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调

    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });
    updateManager.onUpdateFailed(function () {
      return that.Tips({
        title: '新版本下载失败'
      });
    })
    wx.setStorageSync('sceneId', options.scene)
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    //清空购物车
    wx.removeStorage({
      key: 'cart',
      success: function (res) {

      }
    })
    if (options.scene == 1069 || options.scene == 1036 || options.scene == 1089 || options.scene == 1090) {
      // console.log('========场景值', options.scene)
    }
    if (options.query.hasOwnProperty('scene')) {
      switch (options.scene) {
        //扫描小程序码
        case 1047:
          that.globalData.shareForm = 1
          break;
          //长按图片识别小程序码
        case 1048:
          that.globalData.shareForm = 1
          break;
          //手机相册选取小程序码
        case 1049:
          that.globalData.shareForm = 1
          break;
          //直接进入小程序
        case 1001:
          that.globalData.shareForm = 2
          break;
      }
    }
  },
  onShow: function (e) {
    // livePlayer.getOpenid({
    //     room_id: 72
    //   }) // 该接口传入参数为房间号
    //   .then(res => {
    //     console.log('get openid', res.openid) // 用户openid
    //   }).catch(err => {
    //     console.log('get openid', err)
    //   })
    // console.log(e.scene, 'e.scene1111111111111')
    switch (e.scene) {
      //扫描小程序码
      case 1047:
        this.globalData.shareForm = 1
        break;
        //长按图片识别小程序码
      case 1048:
        this.globalData.shareForm = 1
        break;
        //手机相册选取小程序码
      case 1049:
        this.globalData.shareForm = 1
        break;
        //直接进入小程序
      case 1001:
        this.globalData.shareForm = 2
        break;
    }
    if (e.scene == 1007 || e.scene == 1008 || e.scene == 1044) {
      livePlayer.getShareParams()
        .then(res => {
          // console.log('get room id', res.room_id) // 房间号
          // console.log('get openid', res.openid) // 用户openid
          // console.log('get share openid', res.share_openid) // 分享者openid，分享卡片进入场景才有
          // console.log('get custom params', res.custom_params) // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
          wx.request({
            url: 'https://api2.yuelvhui.com/app/auth/weixin/bindDaRen',
            data: {
              "clickOpenId": res.openid,
              "shareOpenId": res.share_openid
            },
            method: 'POST',
            header: {
              'content-type': 'application/json',
              'Authorization': 'Sys 2001.1572445472000.381d2a3926cb49cb964efe1b565be95f'
            },
            success(res) {
              // console.log(res, 'ppppppp')
            }
          })
        }).catch(err => {
          // console.log('get share params', err)
        })
    }
    let uid = wx.getStorageSync('uid') ? wx.getStorageSync('uid') : ''
    // console.log(wx.getStorageSync('uid'), '-----')

    wx.request({
      url: 'https://api2.yuelvhui.com/app/getToken',
      data: {
        uid: wx.getStorageSync('uid')
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.setStorageSync('token', res.data.data)
        // console.log(res.data.data)
      }
    })
    wx.setStorageSync('isarticle', false)
    // console.log('........appjs onshow')
    wx.setStorageSync('videoDetail', true),
      wx.setStorageSync('christmas', true),
      wx.setStorageSync('homeShow', true), //首页是否刷新

      // console.log('........appjs onshow videoDetail', wx.getStorageSync('videoDetail'))
      wx.login({
        success(loginRes) {
          // console.log(loginRes, 'loginReloginReloginReloginReloginRe')
          wx.request({
            url: 'https://api2.yuelvhui.com/app/auth/weixin/getOpenId',
            data: {
              "code": loginRes.code,
              "mid": uid
            },
            method: 'POST',
            header: {
              'content-type': 'application/json',
              'Authorization': 'Sys 2001.1572445472000.381d2a3926cb49cb964efe1b565be95f'
            },
            success(res) {
              // console.log(res)
              wx.setStorageSync('openId', res.data.openId)
            }
          })
        }
      })
  },
  getLoginInfo: function (fn) {
    var that = this;
  },
  onLoad: function (options) {

  },
  /**
   * 各首页banner跳转
   * redirecttype 类别
   */
  classificationList: function (e, that) {
    let {
      redirecttype,
      name,
      id,
      typeid,
      skuid,
      channelid,
      hotid,
      brandid,
      url,
      actid
    } = e.currentTarget.dataset
    // console.log(redirecttype, skuid, id)
    if (redirecttype == 0) { //寺库全品
      wx.navigateTo({
        url: '/page/Yuemall/pages/JDclassification/JDclassification?channelId=' + 1
      })
    } else if (redirecttype == 1) { //自营-特惠
      wx.navigateTo({
        url: '/page/Yuemall/pages/dailySpecial/dailySpecial?reType=' + '1' + '&title=' + name + '&parentTypeId=' + typeid,
      })
    } else if (redirecttype == 2) { //寺库列表
      wx.navigateTo({
        url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + typeid + '&name=' + name
      })
    } else if (redirecttype == 3) { //商品详情
      wx.navigateTo({
        url: '/page/Yuemall/pages/details/details?parentTypeId=' + '&goodsId=' + id + '&skuid=' + skuid,
      })
    } else if (redirecttype == 5) { //会员卡
      wx.switchTab({
        url: '/page/EliteCard/EliteCard',
      })
    } else if (redirecttype == 6) { //网易
      wx.navigateTo({
        url: '/page/Yuemall/pages/AllCategories/AllCategories?type=' + 'wangyi',
      })
    } else if (redirecttype == 7) { //大人
      wx.navigateToMiniProgram({
        appId: 'wx3b5c2af451998243',
        path: '',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (redirecttype == 8) { //酒店列表
      wx.navigateToMiniProgram({
        appId: 'wx84facba553e869a1',
        path: '',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (redirecttype == 9) { //抽奖
      wx.navigateTo({
        url: '/page/other/pages/LuckDraw/LuckDraw',
      })
    } else if (redirecttype == 10) { //爆款
      wx.navigateTo({
        url: '/page/Yuemall/pages/HotStyle/HotStyle?typeId=' + typeid + '&id=' + hotid + '&name=' + name,
      })
    } else if (redirecttype == 11) { //消费旅游
      wx.navigateTo({
        url: '/page/other/pages/YueNews/YueNews',
      })
    } else if (redirecttype == 12) { //线路详情
      wx.navigateToMiniProgram({
        appId: 'wx84facba553e869a1',
        path: '/page/line/pages/detail/detail?LineId=' + id,
        extraData: {
          LineId: +id
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (redirecttype == 13) { //京东分类
      wx.navigateTo({
        url: '/page/Yuemall/pages/JDclassification/JDclassification?channelId=' + 3,
      })
    } else if (redirecttype == 14) { //普通酒店详情
      wx.navigateToMiniProgram({
        appId: 'wx84facba553e869a1',
        path: '/page/hotel/pages/home/hotel/hotelList/index?hotelId=' + id,
        extraData: {
          hotelId: +id
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })

    } else if (redirecttype == 15) { //高星酒店详情
      wx.navigateTo({
        url: '/page/hotel/pages/threeStarsHotelInfo/threeStarsHotelInfo?hotelId=' + id,
      })
    } else if (redirecttype == 16) { //国际酒店详情
      wx.navigateToMiniProgram({
        appId: 'wx84facba553e869a1',
        path: '/page/hotel/pages/InternationaDetail/InternationaDetail?hotelId=' + id,
        extraData: {
          hotelId: +id
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (redirecttype == 22) { //消费抽奖码
      wx.navigateTo({
        url: '/page/other/pages/utourletLuckyDraw/utourletLuckyDraw',
      })
    } else if (redirecttype == 24) { //全球购
      wx.navigateTo({
        url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + typeid + '&name=' + name + '&url=' + '/mall/allEarthList' + '&typePage=' + 'quanqiugou',
      })
    } else if (redirecttype == 25) { //开学季
      wx.navigateTo({
        url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + typeid + '&name=' + name + '&id=' + id + '&url=' + '/mall/nineShop' + '&typePage=' + 'jiuyuandian' + '&channelId=' + 3,
      })
    } else if (redirecttype == 26) { //会员七折购
      wx.navigateTo({
        url: '/page/Yuemall/pages/MemberPurchase/MemberPurchase?name=' + name,
      })
    } else if (redirecttype == 27) { //top100
      wx.navigateTo({
        url: 2,
      })
    } else if (redirecttype == 28) { //女神节
      wx.navigateTo({
        url: '/page/Yuemall/pages/FacialMask/FacialMask',
      })
    } else if (redirecttype == 31) { //秒杀
      wx.navigateTo({
        url: '/page/Yuemall/pages/RushBuyList/RushBuyList',
      })
    } else if (redirecttype == 33) { //限时半价
      wx.navigateTo({
        url: '/page/Yuemall/pages/HalfPrice/HalfPrice',
      })
    } else if (redirecttype == 34) { //拼团
      wx.navigateTo({
        url: '/page/Yuemall/pages/AssembleList/AssembleList'
      })
    } else if (redirecttype == 32) { //砍价
      wx.navigateTo({
        url: '/page/Yuemall/pages/BargainPriceList/BargainPriceList'
      })
    } else if (redirecttype == 36) { //积分商城详情
      wx.navigateTo({
        url: '/page/Yuemall/pages/IntegralMallDatail/IntegralMallDatail?goodsId=' + id,
      })
    } else if (redirecttype == 37) { //积分商城列表
      wx.navigateTo({
        url: '/page/Yuemall/pages/IntegralMall/IntegralMall'
      })
    } else if (redirecttype == 38) { //优惠券列表
      wx.navigateTo({
        url: '/page/Yuemall/pages/CouponList/CouponList',
      })
    } else if (redirecttype == 39) { //新爆款
      wx.navigateTo({
        url: '/page/Yuemall/pages/NewHotStyle/NewHotStyle?typeId=' + typeid + '&id=' + hotid + '&name=' + name,
      })
    } else if (redirecttype == 40) { //秒杀
      wx.navigateTo({
        url: "/page/yueMember/pages/CouponCenter/CouponCenter?activityId=" + id
      })
    } else if (redirecttype == 41) { //领券详情
      wx.navigateTo({
        url: "/page/yueMember/pages/CouponCenter/CouponCenter?cid=" + id
      })
    } else if (redirecttype == 42) { //
      wx.navigateTo({
        url: '/page/Yuemall/pages/LevelPages/LevelPages?name=' + name + '&id=' + hotid + '&channelId=' + channelid,
      })
    } else if (redirecttype == 43) { //考拉海购
      wx.navigateTo({
        url: '/page/Yuemall/pages/JDclassification/JDclassification?channelId=' + 6,
      })
    } else if (redirecttype == 44) { //京东特价
      if (channelid == 3) {
        wx.navigateTo({
          url: '/page/Yuemall/pages/JDSpecialOffer/JDSpecialOffer?channelId=' + channelid + '&name=' + name + '&id=' + 0
        })
      } else {
        wx.navigateTo({
          url: '/page/Yuemall/pages/JDSpecialOffer/JDSpecialOffer?channelId=' + channelid + '&name=' + name + '&id=' + id
        })
      }

    } else if (redirecttype == 45) { //母婴玩具 数码家电 视频生鲜 美妆个护
      wx.navigateTo({
        url: '/page/Yuemall/pages/NewLevelPages/NewLevelPages?channelId=' + channelid + '&name=' + name + '&id=' + id
      })
    } else if (redirecttype == 46) { //手机充值/视频会员
      // wx.navigateTo({
      //   url: '/page/yueMember/pages/VideoRecharge/VideoRecharge'
      // })
    } else if (redirecttype == 47) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/MembershipProductDetails/MembershipProductDetails?goodsId=' + id + '&skuid=' + skuid
      })
    } else if (redirecttype == 48) { //新罗
      wx.navigateToMiniProgram({
        appId: 'wx07b5caa7866d1697',
        path: '',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release',
        success(res) {}
      })
    } else if (redirecttype == 49) { //
      wx.navigateTo({
        url: '/page/Yuemall/pages/LevelList/LevelList?keyWord=' + name + '&type=' + 'brand' + '&brandId=' + brandid
      })
    } else if (redirecttype == 50) { //悦旅大学
      wx.navigateTo({
        url: '/page/yueMember/pages/University/University'
      })
    } else if (redirecttype == 51) { //排行榜
      wx.navigateTo({
        url: '/page/Yuemall/pages/RankingList/RankingList'
      })
    } else if (redirecttype == 52) { //行云
      wx.navigateTo({
        url: '/page/Cloud/pages/index/index'
      })
    } else if (redirecttype == 57) { //线路列表（周边游）
      wx.navigateToMiniProgram({
        appId: 'wx84facba553e869a1',
        path: '/page/line/pages/LineRevision/superiorProducts/superiorProducts?name=' + name + '&id=' + id + '&typeStatus=' + 3,
        extraData: {
          name: name,
          id: id,
          typeStatus: 3
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (redirecttype == 58) { //定制游
      wx.navigateTo({
        url: '/page/other/pages/CustomTour/CustomTour?url=https://api2.yuelvhui.com/app/customized/create',
      })
    } else if (redirecttype == 59) { //酒店首页
      wx.navigateToMiniProgram({
        appId: 'wx84facba553e869a1',
        path: '/page/hotelHome/hotel/hotel',
        extraData: {

        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (redirecttype == 60) { //火车票
      // console.log('----')
      wx.navigateToMiniProgram({
        appId: 'wxd4b442000ca319d7',
        path: '/page/TrainTicketsHome/TrainTicketsHome',
        extraData: {

        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (redirecttype == 62) { //途牛   线路首页
      wx.navigateToMiniProgram({
        appId: 'wx84facba553e869a1',
        path: '/page/LineRevision/LineRevision/LineRevision',
        extraData: {

        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (redirecttype == 63) { //当当  单个分类
      wx.navigateTo({
        url: '/page/Yuemall/pages/DangdangList/DangdangList?id=' + id + '&name=' + name
      })
    } else if (redirecttype == 64) { //当当  全部分类
      wx.navigateTo({
        url: '/page/Yuemall/pages/Dangclassification/Dangclassification'
      })
    } else if (redirecttype == 66) { //曹操出行
      wx.navigateToMiniProgram({
        appId: 'wx84facba553e869a1',
        path: '/page/CaoCaoTravel/CaoCaoTravel',
        extraData: {

        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (redirecttype == 65) { //当当 
      wx.navigateTo({
        url: '/page/Yuemall/pages/DangHome/DangHome'
      })
    } else if (redirecttype == 69) { //圣诞活动 
      wx.navigateTo({
        url: '/page/Yuemall/pages/Christmas/Christmas'
      })
    } else if (redirecttype == 70) { //食品
      wx.navigateTo({
        url: '/page/Yuemall/pages/NewLevelPagesComp/NewLevelPagesComp?channelId=' + channelid + '&name=' + name + '&id=' + id
      })
    }else if (redirecttype == 71) { // 美妆
      wx.navigateTo({
        url: '/page/Yuemall/pages/NewLevelPagesComp/NewLevelPagesComp?channelId=' + channelid + '&name=' + name + '&id=' + id
      })
    } else if (redirecttype == 76) { //必买
      wx.navigateTo({
        url: '/page/Yuemall/pages/mustBuy/mustBuy'
      })
    } else if (redirecttype == 82) { //饿了么
      wx.navigateTo({
        url: '/page/Yuemall/pages/ELM/ELM'
      })
    } else if (redirecttype == 87) { //京东
      wx.navigateTo({
        url: '/page/Yuemall/pages/JDUnion/JDUnion'
      })
    } else if (redirecttype == 93) { //唯品会
      wx.navigateTo({
        url: '/page/Yuemall/pages/WeiPH/WeiPH'
      })
    } else if (redirecttype == 97) { //打赏金

      wx.navigateTo({
        url: `/page/other/pages/Reward/Reward?url=${encodeURIComponent(url)}`
      })
      // console.log(url)
    } else if (redirecttype == 98) { //视频
      wx.navigateTo({
        url: '/page/other/pages/LiveNotice/LiveNotice?actId=' + actid
      })
    } else if (redirecttype == 666) { //当当  banner跳转
      // wx.navigateTo({
      //   url: ''
      // })
    } else if (redirecttype == 20000) { //美团酒店
      wx.navigateToMiniProgram({
        appId: 'wx84facba553e869a1',
        path: '/page/hotel/pages/home/hotel/meituanhotelList/index?hotelType=' + 'hotel',
        extraData: {
          hotelType: 'hotel'
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })

    } else if (redirecttype == 29) { //在线义诊
      wx.navigateTo({
        url: '/page/other/pages/Online/Online'
      })
    } else if (redirecttype == 83) { //团长免费拿
      wx.navigateTo({
        url: '/page/assembleFree/page/assembleFree/assembleFree'
      })
    } else if (redirecttype == 77) { //拼多多
      wx.navigateTo({
        url: '/page/Yuemall/pages/PinHome/PinHome'
      })
    } else if (redirecttype == 92) { //女神节活动免费拿
      wx.navigateTo({
        url: '/page/Yuemall/pages/bookingActivities/bookingActivities'
      })
    } else if (redirecttype == 99) { //邀请有礼
      wx.navigateTo({
        url: '/page/Yuemall/pages/InvitationGifts/InvitationGifts?activityId=' + id
      })
    } else if (redirecttype == 102) { //一分钱抽奖
      // console.log('/page/Yuemall/pages/luckDraw/luckDraw?drawId=' + id, id)
      wx.navigateTo({
        url: '/page/Yuemall/pages/luckDraw/luckDraw?drawId=' + id
      })
    } else if (redirecttype == 103) { // 爆款活动
      wx.navigateTo({
        url: '/page/Yuemall/pages/hotStyleNew/hotStyleNew'
      })
    } else if (redirecttype == 108) { // 社群团购
      wx.navigateTo({
        url: '/page/community/pages/main/index'
      })
    } else if (redirecttype == 109) { // 攻略
      wx.switchTab({
        url: '/page/strategy/index/index'
      })
    }
  },

  globalData: {
    positionFrom: 0,
    shareForm: 2,
    isMeber: false,
    isSetList: true,
    navigate_type: 1,
    reqUrl: 'https://dicufno.com', //请求地址
    version: '1.0.0', //版本
    sign: 'MD5', //签名方式
    userInfo: null, //wx个人信息
    openid: '', //wx openid
    userid: '188e8c31d2d9ed6a7ab01b2ad8137ff0', //用户id
    changes: '', //判断是仅退款或退货退款
    //丁新 本地存储提示
    lineDepartCity: '北京', //线路出发地 搜索数组 lineDepartCityArr
    lineDestinationCity: '', //线路目的地
    lineDestinationCityHistoryArr: [], //线路目的地历史数组

    hotelDepartCity: '北京', //酒店
    hotelDepartId: '1', //酒店Id
    // hotelDepartCityHsitoryCityArr: [],//酒店城市数组
    // hotelDepartCityHistoryIdArr: [],//酒店城市id数组
    hotelEntranceTime: '', //酒店入住时间
    hotelEntranceWeek: '', //酒店入住星期
    hotelLeaveTime: '', //酒店离店时间
    hotelLeaveWeek: '', //酒店离店星期
    hotelDay: '', //酒店入住天数
    hotelSearchHistory: '', //酒店条件搜索历史

    //Sander 详情-购物车页面缓存数据
    title: '', //购物车列表标题
    vipPrice: '', //购物车列表钱数,
    image: '', //购物车列表图片
    labelName: '', //购物车列表规格
    GoodsId: [{
        index: '1',
        isChecked: false,
        amountNumber: 0
      },
      {
        index: '1',
        isChecked: false,
        amountNumber: 0
      }
    ], //购物车列表商品ID
    amountNumber: '',
    shoppingCartNumber: '0', //购物车数量
    currentTab: '',
    couponBox: false, //购买大礼包后 弹框状态
    timer: require('/utils/wxTimer-master/wxTimer.js') //倒计时
  }
})