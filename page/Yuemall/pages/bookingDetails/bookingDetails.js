import {
  get,
  post,
  relations,
  retrunScene,
} from '../../../../utils/util.js';
import WxParse from "../../../../wxParse/wxParse/wxParse.js"
var app = getApp();
var timer = require('../../../../utils/wxTimer-master/wxTimer.js')
// var app = getApp().globalData
var glo = app.globalData
timer = glo.timer;
var wxTimer1;
var previewOnshow; // 解决图片预览 出发onshow
Page({
  /** 
   * 页面的初始数据
   */
  data: {
    three: 5,
    imagenum: 20,
    scrollTop: 0,
    scrollId: '', //选中ID
    tabIndex: 0,
    lineText: [{
      title: '宝贝'
    }, {
      title: '评论'
    }, {
      title: '详情'
    }],
    sureId: 0,
    Share: true,
    gopay: false,
    wxTimer: '',
    wxTimerSecond: '',
    wxTimerList: {},
    time: '00:00:10',
    isRushBuy: '距开抢时间',
    orderData: [],
    addressCode: 0,
    uid: '',
    token: '',
    codeNumber: '',
    bannerItem: [],
    showModalStatus: false, //弹窗状态
    showModal: false,
    selectLabel: '请选择规格',
    selectNum: '数量',
    mobile: '',
    label: [{
        name: '2.0kg/份',
        index: 1
      },
      {
        name: '4.0kg/份',
        index: 2
      }
    ],
    isaddress: false,
    amountNumber: 1,
    shoppingCartNumber: '',
    Tab: 0,
    title: '',
    moneyPrice: '266.20',
    image: '../../../../images/YueMall/banner.jpg',
    labelName: '',
    goodsId: '',
    goodDesc: '',
    goodPrice: '',
    vipPrice: '',
    cardType: '',
    current: 0,
    sharelayer: false,
    notBuyMessage: '', //想买这个东西,分人
    sizeSelectText: [],
    colorSize: [],
    statusArr: [], //各行规格默认选中项
    selectedSku: [], //选中sku的列表
    authorizationStatus: false, //授权按钮状态
    isIdentification: '',
    channelIcon: '',
    recommendGoods: [],
    seckillPrice: '',
    startHour: '',
    realName: false, //是否实名
  },
  onLoad: function (options) {
    console.log(options)
    console.log('3333333333333333')
    let that = this
    let scene = '';
    let reCode = '';
    let goodsId = '';
    let activityId = ''
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        console.log(sceneObj)
        reCode = sceneObj.C;
        goodsId = sceneObj.I;
        activityId = sceneObj.A
      });
    } else {
      reCode = options.reCode;
      goodsId = options.goodsId;
      activityId = options.activityExtId
    }
    that.setData({
      goodsId: goodsId,
      activityId: activityId,
    })
    console.log(this.data.activityId, options.activityExtId)

    //取自己的邀请码
    wx.getStorage({
      key: 'reCode',
      success: function (res) {
        that.setData({
          reCode: res.data
        })
      }
    })
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      // cardType: wx.getStorageSync('cardType')
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  // Booking: function () {
  //   let that = this
  //   if (wx.getStorageSync('uid')) {
  //     post('/mall/flashGoodsReserve', {
  //       mid: wx.getStorageSync('uid'),
  //       sec_act_ext_id: that.data.activityId,
  //       goods_id: that.data.goodsId,
  //       sku_id: that.data.skuid
  //     }, (res) => {
  //       console.log(res)
  //       if (res.data.code == 200) {
  //         wx.showToast({
  //           title: res.data.msg,
  //           icon: 'none'
  //         })
  //         post('/mall/freeActDetail', {
  //           goodsId: that.data.goodsId,
  //           uid: wx.getStorageSync('uid'),
  //           activityExtId: that.data.activityId
  //         }, (res) => {
  //           if (res.data.code == 200) {
  //             that.setData({
  //               isStock: res.data.FlashGoodsInfo.isStock, //是否抢光
  //               isReserve: res.data.FlashGoodsInfo.isReserve //是否预约
  //             })
  //           } else {
  //             wx.showToast({
  //               title: res.data.msg,
  //               icon: "none"
  //             })
  //           }
  //         }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  //       }
  //     }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  //   } else {
  //     that.VerificationCode()
  //   }
  // },
  amountNumberInput: function (e) {
    this.setData({
      amountNumber: e.detail.value
    })
  },
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {}
        })
      },
      complete(res) {}
    })
  },
  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  // 查看更多评论
  lookComment: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/lookComment/lookComment?productid=' + this.data.goodsId,
    })
  },
  // 点击标题切换
  NavTab: function (e) {
    let that = this
    let cur = e.currentTarget.dataset.index;
    if (that.data.tabIndex == cur) {
      return false;
    } else {
      that.setData({
        tabIndex: cur,
        scrollId: 'd' + cur
      })
      console.log('d' + cur)
    }
  },
  /**
   * 页面滑动
   */
  bindscroll: function (e) {
    let data = this.data
    let scrollTop = e.scrollTop
    this.setData({
      scrollTop: e.detail.scrollTop
    })
    if (e.detail.scrollTop > 100) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#F34746',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
    if (e.detail.scrollTop == 0) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
  },
  // 销毁页面
  onUnload: function () {
    if (this.data.success == 'success') {
      wx.navigateBack({
        delta: 2
      })
    }
    wxTimer1 = null
  },
  // 图片点击事件
  imgYu: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    previewOnshow = true; //解决图片预览出发onshow
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //收藏
  Collection: function (e) {
    let that = this
    if (wx.getStorageSync('uid')) {
      wx.getStorage({
        key: 'token',
        success: function (token) {
          wx.getStorage({
            key: 'uid',
            success: function (uid) {
              that.setData({
                uid: uid.data
              })
              post('/mall/productCollect/' + that.data.goodsId + '/' + that.data.skuid + '/' + uid.data, {

              }, (res) => {
                if (res.data.code == 200) {
                  that.setData({
                    collectState: res.data.data.collectState
                  })
                  if (res.data.data.collectState == 1) {
                    wx.showToast({
                      title: '收藏成功',
                      icon: 'none'
                    })
                  } else {
                    wx.showToast({
                      title: '取消成功',
                      icon: 'none'
                    })
                  }
                } else {

                }
              }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
            }
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
      })
    }
  },
  // 轮播 点击事件
  bindChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  // 倒计时
  startTimer: function (totalSecond) {
    console.log(totalSecond)
    let that = this
    // 倒计时
    var totalSecond = totalSecond;
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;

      // 小时位
      var hr = Math.floor((second) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        that.getOrderList()
        clearInterval(interval);
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });

      }
    }.bind(this), 1000);
  },
  // 电话
  calltel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },

  //秒数 转化成天、小时、秒
  turnTimeFormat: function (seconds) {
    let day = Math.floor(seconds / 60 / 60 / 24);
    let hours = Math.floor(seconds / 60 / 60 % 24);
    let min = Math.floor(seconds / 60 % 60);
    let sec = Math.floor(seconds % 60);
    return {
      day: day,
      time: +hours + ':' + min + ':' + sec
    }
  },
  // 切换地址
  address: function () {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/addressAdministration/addressAdministration?Mywinning=' + 'datilAss',
      })
    }
    //  else {
    //   wx.navigateTo({
    //     url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
    //   })
    // }
  },
  // 加载数据
  getOrderList: function () {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    console.log(that.data.activityId)
    post('/mall/freeActDetail', {
      goodsId: that.data.goodsId,
      uid: wx.getStorageSync('uid'),
      activityExtId: that.data.activityId
    }, (res) => {
      if (res.data.code == 200) {
        console.log(8, res)
        wx.hideLoading()
        that.setData({
          bannerItem: res.data.productInfo.banner,
          goodName: res.data.FlashGoodsInfo.goodName,
          goodDesc: res.data.productInfo.goodsInfo,
          goodVipPrice: res.data.FlashGoodsInfo.goodVipPrice,
          goodPrice: res.data.FlashGoodsInfo.goodPrice,
          priceName: res.data.productInfo.priceName,
          channelId: res.data.productInfo.channelId,
          describe: res.data.productInfo.describe,
          coupon: res.data.productInfo.coupon,
          address: res.data.areaInfo,
          colorSize: res.data.productInfo.saleList,
          goodFreight: res.data.productInfo.goodFreight,
          goodSupplier: res.data.productInfo.goodSupplier,
          goodContent: res.data.productInfo.goodContent,
          shareMoney: res.data.productInfo.shareMoney,
          Specificationsimg: res.data.productInfo.banner[0],
          deduc: res.data.productInfo.deduc,
          activityIdH: res.data.FlashGoodsInfo.activityId,
          flashEndTime: res.data.FlashGoodsInfo.endTime,
          flashStartTime: res.data.FlashGoodsInfo.startTime,
          nowTime: res.data.FlashGoodsInfo.nowTime,
          buyLimit: res.data.FlashGoodsInfo.buyLimit,
          collectState: res.data.productInfo.collectState,
          skuid: res.data.FlashGoodsInfo.productSkuId,
          type: res.data.FlashGoodsInfo.type,
          state: res.data.areaInfo.state,
          comment: res.data.productInfo.comment,
          isIdentification: res.data.isIdentification,
          RushState: res.data.FlashGoodsInfo.state,
          channelIcon: res.data.productInfo.channelIcon,
          seckillPrice: res.data.FlashGoodsInfo.seckillPrice,
          startHour: res.data.FlashGoodsInfo.startHour,
          cardType: res.data.identityType,
          isStock: res.data.FlashGoodsInfo.isStock, //是否抢光
          isReserve: res.data.FlashGoodsInfo.isReserve, //是否预约
          shoppingCartNumber: res.data.productInfo.cartTotal,
          goodsInfo: res.data.productInfo.goodsInfo,
          activityExtId: res.data.FlashGoodsInfo.activityExtId, //活动拓展id
          goodId: res.data.FlashGoodsInfo.goodId,
          isReserve: res.data.FlashGoodsInfo.isReserve,
          statusBuy: res.data.FlashGoodsInfo.state,
          isStock: res.data.FlashGoodsInfo.isStock,
          isOrder: res.data.FlashGoodsInfo.isOrder,
          restCount: res.data.FlashGoodsInfo.restCount,
          count: res.data.FlashGoodsInfo.count
        })
        this.initSelected(res.data.productInfo.saleList, that.data.skuid)
        // 推荐
        post('/mall/V2/recommendGoods', {
          uid: wx.getStorageSync('uid'),
          goodsId: that.data.goodsId
        }, (res) => {
          console.log(res)
          if (res.data.code == 200) {
            that.setData({
              recommendGoods: res.data.data
            })
          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
        // 定时器
        if (res.data.FlashGoodsInfo.state == 1) {
          that.startTimer(res.data.FlashGoodsInfo.startTime - res.data.FlashGoodsInfo.nowTime)
        } else {
          that.startTimer(res.data.FlashGoodsInfo.endTime - res.data.FlashGoodsInfo.nowTime)
        }
        WxParse.wxParse('article', 'html', res.data.productInfo.goodContent, that, 5);
        that.postShareImg(that.data.goodsId, that);
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    post('/app/mall/signStatic/' + wx.getStorageSync('uid'), {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          mining: res.data.data
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true)
  },
  // 去支付
  gopay: function (e) {
    let that = this
    if (that.data.isCanBuy == 0) {
      wx.showToast({
        title: that.data.notBuyMessage,
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.setData({
      sureId: 2
    })
    that.showModal();
    that.setData({
      Share: false,
      gopay: true
    })
  },
  // 购物车
  GoCart: function (e) {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/Cart/Cart',
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
      })
    }
  },
  // 确定
  sure: function (e) {
    let that = this
    if (e.currentTarget.dataset.id == 1) { //加入购物车
      if (that.data.amountNumber != 0) {
        if (that.data.leaderId == undefined || that.data.leaderId == '') { //大人
          that.setData({
            leaderId: 0
          })
        }

        post('/mall/cart/create2', {
          product_id: that.data.goodsId,
          product_sku_id: that.data.last_sku,
          uid: wx.getStorageSync('uid'),
          activity_Id: that.data.activityId,
          goodsNum: that.data.amountNumber,
          share_form: app.globalData.shareForm,
          position_from: app.globalData.positionFrom
        }, (res) => {
          console.log(res, 7777)
          if (res.data.status == 200) {
            wx.showToast({
              title: '加入成功',
              icon: 'none'
            })
            console.log(res.data.data.cartTotalNum)
            that.setData({
              shoppingCartNumber: res.data.data.cartTotalNum,
              cartGoodsNum: res.data.data.cartGoodNum
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 1, that.data.token, true, that.data.uid, 4)
      } else {
        wx.showToast({
          title: '至少选择一个商品',
          icon: 'none'
        })
      }
    } else {
      // 是否已开抢
      if (that.data.RushState == 1) {
        wx.showToast({
          title: '该商品未开抢',
          icon: 'none'
        })
        return
      }

      // 已抢光
      if (that.data.isStock == 0) {
        wx.showToast({
          title: '该商品已抢光',
          icon: 'none'
        })
        return
      }
      if (e.currentTarget.dataset.amountnumber == 0) {
        wx.showToast({
          title: '请选择规格数量',
          icon: 'none'
        })
      } else {
        let addressIds = that.data.addressCode == 0 ? (that.data.address.proviceId + '_' + that.data.address.cityId + '_' + that.data.address.zoneId + '_' + that.data.address.townId == '' ? 0 : that.data.address.townId) : that.data.addressCode
        let addressType = that.data.channelId == 3 ? 1 : 0
        wx.navigateTo({
          url: '../RushBuyBalance/RushBuyBalance?Entrance=' + 'RushBuy' + '&goodsnum=' + e.currentTarget.dataset.amountnumber + '&goodid=' + e.currentTarget.dataset.goodid + '&skuid=' + that.data.skuid + '&areaid=' + that.data.address.addressId + '&activityId=' + that.data.activityExtId + '&type=' + that.data.type
          // url: '../RushBuyBalance/RushBuyBalance?Entrance=' + 'RushBuy' + '&goodsnum=' + e.currentTarget.dataset.amountnumber + '&goodid=' + 378191 + '&skuid=' + 399242 + '&areaid=' + that.data.address.addressId + '&activityId=' + 11229 + '&type=' + that.data.type
        })
      }
    }
    that.hideModal()
  },
  // 规格
  swichLabel: function (e) {
    let that = this
    //选中index

    var index = e.currentTarget.dataset.idx;
    //选中行index
    var data_index = e.currentTarget.dataset.index;
    that.selectLabel(index, data_index);
  },
  selectLabel(index, data_index) {
    let that = this;
    let colorSize = that.data.colorSize;
    var idx = index;
    // let arr=[]
    //选中sku
    var sku = colorSize[index].buttons[data_index]['skuList']
    //选中第几行第几个
    that.data.statusArr[index] = data_index
    //取出其他sku
    let m = []
    that.setData({
      sizeSelectText: []
    })
    var is_selected_skus = {};
    this.data.statusArr.map((b, a) => {
      if (a != idx && (typeof this.data.statusArr[a] != "undefined")) {
        is_selected_skus[a] = colorSize[a].buttons[this.data.statusArr[a]].skuList;
      }
      that.data.sizeSelectText.push(colorSize[a].buttons[this.data.statusArr[a]].text)
    })
    for (let i = 0; i < colorSize.length; i++) {
      var channel_data = colorSize[i].buttons;

      for (let j = 0; j < channel_data.length; j++) {
        if (i != idx) {
          var sku_isists = Array.intersect(sku, channel_data[j].skuList);
          for (let [c, d] in is_selected_skus) {
            if (c != i) {
              sku_isists = Array.intersect(sku_isists, is_selected_skus[c]); //is_selected_skus非当前行其他行选中的元素
            }
          }
          if (sku_isists.length) {
            colorSize[i].buttons[j].isEnable = true;
          } else {
            colorSize[i].buttons[j].isEnable = false;
          }
        } else {
          if (j == data_index) {
            colorSize[i].buttons[j].isEnable = true;
          } else if (colorSize.length == 1) {
            colorSize[i].buttons[j].isEnable = true;
          }
        }
      }
    }
    let last_sku = sku
    for (let [c, d] in is_selected_skus) {
      last_sku = Array.intersect(last_sku, is_selected_skus[c]);
    }
    this.setData({
      statusArr: this.data.statusArr,
      colorSize: colorSize,
      last_sku: last_sku[0],
      skuid: last_sku[0],
      sizeSelectText: that.data.sizeSelectText
    })
    if (colorSize[index]['title'] == '颜色') {
      that.setData({
        Specificationsimg: colorSize[index].buttons[data_index]['img']
      })
    }
  },


  // 添加商品数量
  addNumber: function (e) {
    let num = e.currentTarget.dataset.num;
    if (num < this.data.buyLimit) {
      this.setData({
        amountNumber: num + 1
      })
    } else {
      wx.showToast({
        title: '该商品限购一个',
        icon: 'none'
      })
    }
  },
  // 减少商品数量
  subtract: function (e) {
    let num = e.currentTarget.dataset.num
    if (num != 1) {
      this.setData({
        amountNumber: num - 1
      })
    } else {
      wx.showToast({
        title: '受不了了，宝贝不能在减少了哦',
        icon: 'none'
      })
    }
  },
  // 未实名 点击确认
  closeRealName: function () {
    this.setData({
      realName: false
    })
    this.hideModal()
  },
  /**
   * 加入购物车 返回商品总数加上用户选择规格数量相加 goodNum
   * */
  addCart: function (e) {
    let that = this
    console.log(e)
    // 判断 是否实名
    if (that.data.isIdentification == 0) {
      that.setData({
        realName: true
      })
      return
    }
    if (wx.getStorageSync('uid')) {
      if (that.data.state == 0) {
        wx.showToast({
          title: '请选择配送地',
          icon: 'none'
        })
      } else {
        // that.showModal();
        // that.setData({
        //   Share: false,
        //   gopay: true
        // })
        let addressIds = that.data.addressCode == 0 ? (that.data.address.proviceId + '_' + that.data.address.cityId + '_' + that.data.address.zoneId + '_' + that.data.address.townId == '' ? 0 : that.data.address.townId) : that.data.addressCode
        let addressType = that.data.channelId == 3 ? 1 : 0
        wx.navigateTo({
          url: '../RushBuyBalance/RushBuyBalance?Entrance=' + 'RushBuy' + '&goodsnum=' + e.currentTarget.dataset.amountnumber + '&goodid=' + e.currentTarget.dataset.goodid + '&skuid=' + that.data.skuid + '&areaid=' + that.data.address.addressId + '&activityId=' + that.data.activityExtId + '&type=' + that.data.type

        })
      }
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
      })
    }
  },
  //立即预约
  addSubscribe: function (e) {
    let that = this
    if (that.data.isIdentification == 0) {
      that.setData({
        realName: true
      })
      return
    }
    if (wx.getStorageSync('uid')) {
      if (that.data.state == 0) {
        wx.showToast({
          title: '请选择配送地',
          icon: 'none'
        })
      } else {
        let addressIds = that.data.addressCode == 0 ? (that.data.address.proviceId + '_' + that.data.address.cityId + '_' + that.data.address.zoneId + '_' + that.data.address.townId == '' ? 0 : that.data.address.townId) : that.data.addressCode
        post('/mall/freeActReserve', {
          mid: wx.getStorageSync('uid'),
          goodId: that.data.goodId, //商品id
          productSkuId: that.data.skuid, //商品skuid
          activityId: that.data.activityIdH, //活动id
          activityExtId: that.data.activityExtId, //活动扩展id
          addressId: addressIds, //收货地址id
          codeNum: this.data.reCode, //用户邀请码 （选填，分享时带的参数）
        }, (res) => {
          console.log(res, 7777)
          if (res.data.code == 200) {
            wx.showToast({
              title: '预约成功',
              icon: 'none'
            })

            that.getOrderList()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 1, that.data.token, true, that.data.uid, 4)
        that.setData({
          // Share: false,
          // gopay: true
        })
      }
    } else {
      // wx.navigateTo({
      //   url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
      // })
    }
  },
  //查看订单
  // 前往订单详情
  goOrder() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/NeworderList/NeworderList?cur=0',
    })
  },
  //禁止滑动  
  disMove: function () {

  },
  // 显示弹窗
  showModal: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏弹窗
  hideModal: function () {
    // this.getOrderList()
    this.setData({
      showModal: false,
      Share: true,
      gopay: false
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  // 隐藏分享
  hideModalShare: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
    this.getOrderList()
  },
  // 选择规格
  ToUp: function () {
    let that = this
    if (wx.getStorageSync('uid')) {
      if (that.data.state == 0) {
        wx.showToast({
          title: '请选择配送地',
          icon: 'none'
        })
      } else {
        that.showModal();
        that.setData({
          Share: false,
          gopay: true
        })
      }
    }
    //  else {
    //   wx.navigateTo({
    //     url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
    //   })
    // }
  },
  // 加入会员
  join: function (e) { //加入悦旅会
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },


  onPullDownRefresh: function () {

  },

  onShow: function () {
    let that = this;
    console.log('22222222222222')
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    // this.initSelected(this.data.colorSize, '100000942707')
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      selectLabel: '请选择规格',
      selectNum: '数量',
    })
    wx.getStorageSync('selfReCode')
    if (that.data.isaddress == false) {
      that.getOrderList()
    }
    let interval = setInterval(function () {
      let m = new Date().getMinutes();
      if (m = 0) {
        that.getOrderList()
      }
    }, 60000)
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    // wx.clearStorage('mapId')
    if (wx.getStorageSync('uid')) {
      //已经登陆
      console.log('已经登陆了')
      // that.getOrderList()
      that.setData({
        authorizationStatus: false
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
      that.setData({
        authorizationStatus: true
      })

    }
    let ortherRecode = wx.getStorageSync('ortherReCode') ? wx.getStorageSync('ortherReCode') : 0
    get('/app/member/distribution/record/' + this.data.goodsId + '/' + ortherRecode + '/' + 2, {}, (res) => {
      console.log(res)
      if (res.data.code == 200) {} else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },
  postShareImg: function (goodid, _this) {
    /**
     * 注释 注释 注释！！！！！！！！！
     * 取分享图片
     * 说明
     * url = /getsaleimg
     * type	line/hotel
     * id	type为line时传 线路id,type为hotel时传酒店id
     * prices	现价
     * priced	原价
     * preferential	优惠信息（非必传）
     * cover	活动封面地址
     */


    post('/share/MallProductShare', {
      product_sku_id: _this.data.skuid,
      product_id: goodid,
      goodVipPrice: _this.data.goodVipPrice

    }, (res) => { // 获取分享图片 ajax
      if (res.data.code == 200) {
        _this.sharePostUrl = res.data.img;
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4);
  },
  onShareAppMessage: function () {
    let that = this
    let nickname = wx.getStorageSync('nickname');
    console.log(nickname)
    wx.getStorage({
      key: 'uid',
      success: function (res) {
        that.setData({
          uid: res.data
        });
        wx.getStorage({
          key: 'token',
          success: function (res) {
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
    let goodsId = "";
    if (options.goodsId == null || options.goodsId == 'null' || options.goodsId == 'undefined' || options.goodsId == undefined) {
      goodsId = this.data.goodsId
    } else {
      goodsId = options.goodsId;
    }
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {

    }
    /**
     * 分享回调失效。所以成功失败都送币
     * */
    that.setData({
      isSharingResults: 1,
    })
    get('/app/index/share/' + that.data.isSharingResults + '/' + 2 + '/' + that.data.goodId, {}, (res) => {
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
    return {
      title: '[' + nickname + '邀请你一起抢购]' + this.data.goodName,
      imageUrl: this.sharePostUrl,
      path: "page/Yuemall/pages/RushBuyDetail/RushBuyDetail" + "?reCode=" + value + "&goodsId=" + goodsId + '&uid=' + wx.getStorageSync('uid') + '&activityId=' + that.data.activityId
    }
  },
  // 首页
  gohome: function () {
    wx.switchTab({
      url: "/page/Mall/YueMall",
    })
  },
  // 页面内分享
  onShare: function () {
    if (wx.getStorageSync('uid')) {
      this.setData({
        sharelayer: true
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
      })
    }
  },
  // 关闭分享
  shareLayerClosed: function () {
    this.setData({
      sharelayer: false
    })
  },

  goPoster: function () {
    wx.navigateTo({
      url: "/page/other/pages/poster/poster?goodsId=" + this.data.goodsId + '&url=' + '/share/BuyLimitMallProductForward' + '&id=' + 'half' + '&skuid=' + this.data.activityId,
    })
  },

  /**
   * 初始化默认选中项
   */
  initSelected: function (colorsize, skuid) {
    let arr = new Array(colorsize.length)
    for (let i = 0; i < colorsize.length; i++) {
      for (let j = 0; j < colorsize[i].buttons.length; j++) {
        // colorsize[i].buttons[j].isEnable = true
        if (colorsize[i].buttons[j].skuList.indexOf(Number(skuid)) > -1) {
          // this.data.statusArr[i] = j
          this.selectLabel(i, j);
        }
      }
    }
  }
})