import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityInfo: '',
    shopinfoList: '',
    backGround: '',
    showModalStatus: false, //弹窗状态
    showModal: false,
    selectLabel: '请选择规格',
    selectNum: '数量',
    amountNumber: 1,
    sizeSelectText: [],
    colorSize: [],
    statusArr: [0], //各行规格默认选中项
    selectedSku: [] //选中sku的列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypelist()
    this.getShoplist()
    this.shopCarlist()
  },
  onShow: function () {
    // this.getTypelist()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //白拿商品分类查询
  getTypelist: function () {
    let _self = this;
    post('/mall/V3/getActivityCategoryInfo', {
      id: 521
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading()

        _self.setData({
          activityInfo: res.data.data.activityInfo,
          backGround: res.data.data.activityInfo.backGround
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)

  },
  //白拿商品列表查询
  getShoplist: function () {
    let _self = this;
    post('/mall/V3/newActivityList', {
      id: 521,
      categoryId: 0,
      page: 1,
      pageSize: 10
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading()
        _self.setData({
          shopinfoList: res.data.data[0].goodsInfo
        })
      } else {
        wx.showToast({
          title: res.errMsg,
          icon: "none"
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 商品详情
  getshopDetail: function (e) {
    post('/mall/getProductBuyDatailV4', {
      product_id: e.goodId,
      product_sku_id: e.productSkuId,
      uid: wx.getStorageSync('uid'),
      productType: 0,
      liveId: 0,
      liveUserId: 0,
    }, (res) => {
      if (res.data.code == 200) {
        wx.hideLoading()
        this.setData({
        colorSize:res.data.data.saleList
        })
        console.log(res.data.data)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // sku详情
  skuidDetil: function (e) {
    let that = this
    post('/mall/getProductSkuDatail', {
      uid: wx.getStorageSync('uid'),
      addressCode: 0,
      product_sku_id: e.productSkuId,
      productType: 0,
      liveId: 0,
      liveUserId: 0,
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          Specificationsimg: res.data.data.img,
          goodVipPrice: res.data.data.vipPrice,
          priceName: res.data.data.priceWord,
          goodPrice: res.data.data.nowPrice,
          inventory: res.data.data.inventory,
          goodsId: res.data.data.productId,
          goodsskuId: res.data.data.productSkuId,
          isSale: res.data.data.isSale,
          // state: res.data.data.address.state,
          channelId: res.data.data.channelId,
          categoryArr: res.data.data.categoryArr,
          topCategoryName: res.data.data.topCategoryName,
          endBuy: res.data.data.endBuy, //行云商品 最高购买量
          startBuy: res.data.data.startBuy, //行云商品 最低购买量
          isZhiboGoods: res.data.data.isZhiboGoods,
          zhiboOriginPrice: res.data.data.zhiboOriginPrice,
          zhiboPrice: res.data.data.zhiboPrice,
          goodsType: res.data.data.goodsType, //是什么价
          toMemberInfo: res.data.data.toMemberInfo
        })
        if (res.data.data.activityPrice) {
          that.setData({
            goodsType: 3, // 活动价格
            showPrice: res.data.data.activityPrice,
            hiddenPrice: res.data.data.nowPrice
          })
        }

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  //规格
  skudetailShopcar: function (event) {
    let e = event.currentTarget.dataset.item
    console.log(e)
    this.getshopDetail(e)
    this.skuidDetil(e)
    this.showModal()
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
    console.log(that.data.statusArr)
    that.data.statusArr[index] = data_index
    console.log(that.data.statusArr[index])
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
      console.log(colorSize[a].buttons[this.data.statusArr[a]].text)
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
    console.log(this.data.statusArr)
    this.setData({
      statusArr: this.data.statusArr,
      colorSize: colorSize,
      last_sku: last_sku[0],
      skuid: last_sku[0],
      sizeSelectText: that.data.sizeSelectText
    })
    console.log(that.data.sizeSelectText, this.data.statusArr)
    // this.skuidDetil()
  },
  // 添加商品数量
  addNumber: function (e) {
    let num = e.currentTarget.dataset.num;
    let that = this
    console.log(that.data.amountNumber)
    console.log(that.data.endBuy)

    if ((that.data.amountNumber >= that.data.inventory) && that.data.channelId != 3) {
      wx.showToast({
        title: '库存数不足请重新选择数量',
        icon: 'none'
      })
      return
    }
    if ((that.data.amountNumber >= that.data.endBuy) && that.data.channelId == 7) {
      wx.showToast({
        title: '行云商品最多可购买' + that.data.endBuy + '个',
        icon: 'none'
      })
      return
    }

    that.setData({
      amountNumber: num + 1
    })

  },
  // 减少商品数量
  subtract: function (e) {
    let num = e.currentTarget.dataset.num
    let that = this

    if (num != 1) {
      if ((that.data.amountNumber <= that.data.startBuy) && that.data.channelId == 7) {
        wx.showToast({
          title: '行云商品最少可购买' + that.data.startBuy + '个',
          icon: 'none'
        })
        return
      }
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
  // 加入购物车
  sure:function(){
    let e = this.data
    console.log(e.goodsId)
    post('/mall/cart/createV4', {
      product_id: e.goodsId,
      product_sku_id: e.goodsskuId,
      uid: wx.getStorageSync('uid'),
      position_from:0,
      product_num:this.data.amountNumber,
      isCollage:0
    }, (res) => {
      console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '加入成功',
          icon: "none"
        })
        this.setData({
            shopCarNum:res.data.data.cartTotalNum
        })
        this.hideModal()
        console.log(res.data.data)
      
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  shopCarlist:function(){
    post('/mall/cart/listV4', {
      uid: wx.getStorageSync('uid')
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading()
        if(res.data.data.length==0){
          this.setData({
            shopCarNum:0
          })
        }else{
          this.setData({
            shopCarNum:res.data.data.length
          })
        }
        console.log(res.data.data)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 去购物车
  goShopcar: function () {
    console.log(111)
    wx.navigateTo({
      url: '/page/Yuemall/pages/Cart/Cart',
    })
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
  }
})