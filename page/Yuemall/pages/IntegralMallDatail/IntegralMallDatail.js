import {
  get,
  post,
  relations,
  retrunScene,
} from '../../../../utils/util.js';
import WxParse from "../../../../wxParse/wxParse/wxParse.js"
var app = getApp();
// var app = getApp().globalData
var glo = app.globalData
var previewOnshow; // 解决图片预览 出发onshow
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFill: false,
    three: 5,
    imagenum: 20,
    scrollId: '', //选中ID
    tabIndex: 0,
    productType: 0,
    sureId: 0,
    Share: true,
    gopay: false,
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
    isDisplayFulltext: false,
    islimitInfo: false,
    realName: false, //是否实名
    lineActive: '',
  },
  amountNumberInput: function (e) {
    this.setData({
      amountNumber: 1
      // amountNumber: e.detail.value
    })
  },
  GetSoupons: function (e) {
    let that = this
    let cid = e.currentTarget.dataset.cid
    post('/mall/sendCoupon', {
      uid: wx.getStorageSync('uid'),
      cid: cid
    }, (res) => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        for (let c of that.data.goodsCoupon) {
          if (c.cid == cid) {
            c.couponState = 1
          }
        }
        that.setData({
          goodsCoupon: that.data.goodsCoupon
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  limitInfohidden: function () {
    let that = this
    that.setData({
      islimitInfo: false
    })
  },
  limitInfo: function () {
    let that = this
    that.setData({
      islimitInfo: true
    })
  },
  lookAllarticle: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/Allarticle/Allarticle?goodsId=' + this.data.goodsId,
    })
  },
  copyText: function (e) {
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
  DisplayFulltext: function () {
    console.log('====')
    this.setData({
      isDisplayFulltext: this.data.isDisplayFulltext ? false : true
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
  // 查看更多评论
  lookComment: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/lookComment/lookComment?productid=' + this.data.goodsId,
    })
  },

  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  // 销毁页面
  onUnload: function () {
    if (this.data.success == 'success') {
      wx.navigateBack({
        delta: 2
      })
    }
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

  // 轮播 点击事件
  bindChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

  // 切换地址
  address: function () {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/addressAdministration/addressAdministration?Mywinning=' + 'datil',
      })
    }
  },
  detail: function (e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid
    })
  },
  // 加载数据
  getOrderList: function () {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    let obj = {}
    console.log(that.data.activityId)
    if (that.data.activityId) {
      obj = {
        product_id: that.data.goodsId,
        product_sku_id: that.data.skuid,
        uid: wx.getStorageSync('uid'),
        activityId: that.data.activityId,
        productType: that.data.productType
      }
    } else {
      obj = {
        product_id: that.data.goodsId,
        product_sku_id: that.data.skuid,
        uid: wx.getStorageSync('uid'),
        productType: that.data.productType
      }
    }
    if (that.data.video == 'video') {
      obj.fromBy = 1 //1=>带货视频 0=>默认
    }

    post('/mall/getProductBuyDatail', obj, (res) => {
      if (res.data.code == 200) {
        wx.hideLoading()
        that.setData({
          cardType: res.data.data.identityType,
          isFlash: res.data.data.isFlash,
          lat: that.data.lat,
          bannerItem: res.data.data.banner,
          Specificationsimg: res.data.data.banner[0],
          title: res.data.data.goodName,
          goodDesc: res.data.data.goodsInfo,
          goodPrice: res.data.data.goodPrice,
          goodsFlashPrice: res.data.data.flashInfo.goodsFlashPrice,
          vipPrice: res.data.data.vipPrice,
          nowPrice: res.data.data.nowPrice,
          goodDeduc: res.data.data.deduc,
          goodSupplier: res.data.data.goodSupplier,
          shoppingCartNumber: res.data.data.cartTotal,
          goodId: res.data.data.product_id,
          cartGoodsNum: res.data.data.cartGoodsNum,
          goodContent: res.data.data.goodContent,
          goodFreight: res.data.data.goodFreight,
          colorSize: res.data.data.saleList,
          saleList: res.data.data.saleList,
          lineActive: res.data.data.saleList[0].buttons[0].skuList[0],
          goodsFlashState: res.data.data.flashInfo.goodsFlashState, //抢购状态 0 无抢购商品 1正在抢购 2即将抢购
          goodsIsFlash: res.data.data.flashInfo.goodsIsFlash, //是否是抢购商品
          collectState: res.data.data.collectState, //0为收藏1收藏
          showMoney: res.data.data.showMoney,
          describe: res.data.data.describe,
          remind: res.data.data.remind,
          priceName: res.data.data.priceName,
          shareMoney: res.data.data.shareMoney,
          goodVipPrice: res.data.data.goodVipPrice,
          inventory: res.data.data.inventory,
          coupon: res.data.data.coupon,
          channelId: res.data.data.channelId,
          comment: res.data.data.comment,
          articleInfo: res.data.data.articleInfo,
          goodsCoupon: res.data.data.goodsCoupon,
          commission: res.data.data.commission, //返利钱数
          normalGoods: res.data.data.normalGoods, //是否是返利商品
          isIdentification: res.data.data.isIdentification, //是否实名认证 0 未实名认证  1 已认证
          instruction: res.data.data.instruction, //购买须知
          isUseCoupon: res.data.data.isUseCoupon, //是否有优惠券
          couponRemind: res.data.data.couponRemind, //券后价
          couponPrice: res.data.data.couponPrice,
          isFree: res.data.data.isFree
        })



        if (res.data.data.saleList != '') {
          that.initSelected(res.data.data.saleList, that.data.skuid)

        } else {
          console.log('00000')
          that.skuidDetil()
        }


        WxParse.wxParse('article', 'html', res.data.data.goodContent, that, 5);
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
  // 线路规格
  lineSpecifications(e) {
    this.setData({
      lineActive: e.currentTarget.dataset.skuid,
      skuid: e.currentTarget.dataset.skuid,
    })
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
  // 未实名 点击确认
  closeRealName: function () {
    this.setData({
      realName: false
    })
    this.hideModal()
  },
  // 确定
  sure: function (e) {
    let that = this
    let {
      goodid
    } = e.currentTarget.dataset
    if ((this.data.amountNumber > this.data.inventory) && this.data.channelId != 3) {
      wx.showToast({
        title: '库存数不足请重新选择数量',
        icon: 'none'
      })
    } else {
      if (e.currentTarget.dataset.id == 2) { //立即购买2
        if (e.currentTarget.dataset.amountnumber == 0) {
          wx.showToast({
            title: '请选择规格数量',
            icon: 'none'
          })
        } else {
          let addressIds = that.data.addressCode == 0 ? (that.data.address.proviceId + '_' + that.data.address.cityId + '_' + that.data.address.zoneId + '_' + that.data.address.townId == '' ? 0 : that.data.address.townId) : that.data.addressCode
          let addressType = that.data.channelId == 3 ? 1 : 0
          let video = that.data.video == 'video' ? 'video' : ''
          // console.log('/page/Yuemall/pages/IntegralMallBalancd/IntegralMallBalancd?type=' + 'gopay' + '&amountnumber=' + e.currentTarget.dataset.amountnumber + '&goodid=' + e.currentTarget.dataset.goodid + '&labelName=' + that.data.labelName + '&leaderId=' + that.data.leaderId + '&skuid=' + that.data.skuid + '&addressIds=' + addressIds + '&areaId=' + that.data.address.addressId + '&addressType=' + addressType + '&productType=' + that.data.productType + '&video=' + video)
          // return
          wx.navigateTo({
            url: '/page/Yuemall/pages/IntegralMallBalancd/IntegralMallBalancd?goodId=' + goodid + '&skuid=' + that.data.skuid + '&areaId=' + that.data.address.addressId
          })
        }
      }

      that.hideModal()
      that.getOrderList()
    }

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
    this.skuidDetil()
  },

  // sku详情
  skuidDetil: function () {
    let that = this
    post('/mall/getProductSkuDatail', {
      uid: that.data.uid,
      addressCode: that.data.addressCode,
      product_sku_id: that.data.skuid,
      productType: that.data.productType
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          Specificationsimg: res.data.data.img,
          goodVipPrice: res.data.data.vipPrice,
          priceName: res.data.data.priceWord,
          goodPrice: res.data.data.nowPrice,
          inventory: res.data.data.inventory,
          goodsId: res.data.data.productId,
          isSale: res.data.data.isSale,
          state: res.data.data.address.state,
          channelId: res.data.data.channelId,
          categoryArr: res.data.data.categoryArr,
          topCategoryName: res.data.data.topCategoryName,
          couponPrice: res.data.data.couponPrice,
          integralPrice: res.data.data.integralPrice, //兑换所需豆
          integralCash: res.data.data.integralCash, //兑换所需支付金额
          productClassify: res.data.data.productClassify, //0实物 1虚拟 2线路商品
          integralType: res.data.data.integralType, //0 只有豆   1 有豆有钱
          available: res.data.data.available, //可用的豆
        })
        if (that.data.isaddress == false) {
          if (res.data.data.address.length != 0) {
            that.setData({
              address: res.data.data.address,
              addressCode: res.data.data.address.proviceId + '_' + res.data.data.address.cityId + '_' + res.data.data.address.zoneId + '_' + (res.data.data.address.townId ? res.data.data.address.townId : '0')
            })
          }
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },

  // 添加商品数量
  // addNumber: function(e) {
  //   let num = e.currentTarget.dataset.num;
  //   let that = this
  //   console.log(that.data.amountNumber)

  //   if ((that.data.amountNumber >= that.data.inventory) && that.data.channelId != 3) {
  //     wx.showToast({
  //       title: '库存数不足请重新选择数量',
  //       icon: 'none'
  //     })
  //     return
  //   }

  //   that.setData({
  //     amountNumber: num + 1
  //   })

  // },
  // 减少商品数量
  // subtract: function(e) {
  //   let num = e.currentTarget.dataset.num
  //   let that = this

  //   if (num != 1) {
  //     this.setData({
  //       amountNumber: num - 1
  //     })
  //   } else {
  //     wx.showToast({
  //       title: '受不了了，宝贝不能在减少了哦',
  //       icon: 'none'
  //     })
  //   }
  // },
  /**
   * 加入购物车 返回商品总数加上用户选择规格数量相加 goodNum
   * */
  addCart: function (e) {
    let that = this
    if (wx.getStorageSync('uid')) {
      // ------------------
      // productClassify,//0实物 1虚拟 2线路商品
      if (that.data.productClassify == 0) {
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

    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
      })
    }
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
    this.getOrderList()
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
    // if (wx.getStorageSync('uid')) {
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
    // }
  },
  // 加入会员
  join: function (e) { //加入悦旅会
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },

  onLoad: function (options) {
    let that = this
    let scene = '';
    let reCode = '';
    let goodsId = '';
    let skuid = ''
    let productType = 0
    let Modeliphonex = 'iPhone X'
    let ModeliphonePro = 'iPhone Pro'
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        reCode = sceneObj.C;
        goodsId = sceneObj.I;
        skuid = sceneObj.U
      });
    } else {
      reCode = options.reCode;
      goodsId = options.goodsId;
      skuid = options.skuid
      productType = options.productType ? options.productType : 0
    }
    console.log(options, 'option')
    that.setData({
      goodsId: goodsId,
      skuid: skuid,
      leaderId: options.leaderId,
      isLeader: options.isLeader,
      lng: wx.getStorageSync('lng'),
      lat: wx.getStorageSync('lat'),
      activityId: options.activityId,
      productType: productType,
      video: options.video, //判断是否是从视频进入的  video是
    })
    console.log(productType)
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
      // cardType: wx.getStorageSync('cardType'),
      RushBuy: options.RushBuy,
      success: options.success,
      isFree: options.isFree
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
        console.log(res.model)
        if (res.model.indexOf(Modeliphonex) > -1 || res.model.indexOf(ModeliphonePro) > -1) {
          console.log('---')
          that.setData({
            isFill: true
          })
        }
      }
    })

  },
  onPullDownRefresh: function () {

  },

  onShow: function () {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    // this.initSelected(this.data.colorSize, '100000942707')
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        that.setData({
          skuid: sceneObj.I
        })
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
      amountNumber: 1
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
      //已经绑定了
      console.log('已经绑定了')
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
    console.log(wx.getStorageSync('ortherReCode') + '分享者id')
    let ortherRecode = wx.getStorageSync('ortherReCode') ? wx.getStorageSync('ortherReCode') : 0
    get('/app/member/distribution/record/' + this.data.goodsId + '/' + ortherRecode + '/' + 2, {}, (res) => {
      console.log(res)
      if (res.data.code == 200) { } else if (res.data.code == 400) {
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


    post('/mall/getShareImg', {
      skuId: _this.data.skuid,
      // product_id: goodid,
      uid: wx.getStorageSync('uid')
    }, (res) => { // 获取分享图片 ajax

      if (res.data.code == 200) {
        _this.sharePostUrl = res.data.data.shareImg
        _this.sharePostTitle = res.data.data.shareTitle

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
      title: '[' + nickname + '邀请你一起抢购]' + this.sharePostTitle,
      imageUrl: this.sharePostUrl,
      path: "page/Yuemall/pages/details/details" + "?reCode=" + value + "&goodsId=" + goodsId + '&uid=' + wx.getStorageSync('uid') + "&skuid=" + that.data.skuid + '&productType=' + that.data.productType
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
      url: "/page/other/pages/poster/poster?goodsId=" + this.data.goodsId + '&url=' + '/share/MallProductForward' + '&id=' + 'goods' + '&skuid=' + this.data.skuid,
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
  },
  in_array(stringToSearch, arrayToSearch) {
    for (var s = 0; s < arrayToSearch.length; s++) {
      var thisEntry = arrayToSearch[s].toString();
      if (thisEntry == stringToSearch) {
        return true;
      }
    }
    return false;
  }

})