import {
  get,
  post
} from '../../../../utils/util.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReductionMoney: 0,
    statusIndex: 0,
    skuids: 0,
    goodsCount: 1,
    guigeList: [],
    goodsIdx: 0,
    showGoodsSku: false,
    addInfo: {},
    cartTotal: 0,
    coudanTotal: 0, // 凑单列表总条数
    coudanList: [], // 凑单列表
    collage: 0, // 存储collage参数
    coudanpage: 1, // 凑单页码
    hasAddBuy: 0, // 已经加购的数量
    maxAddBuy: 1, // 最大加购数量
    showCoudanList: false, // 看是凑单列表
    showRedPacket: false, // 显示新人红包
    addMask: false, // 显示老人优惠
    scroll:true,
    showModalStatus: false, //弹窗状态,
    cartId: '',
    receiverName: '',
    mobile: '',
    address: '',
    totelPrice: '',
    couponList: [],
    DiscountAmount: '',
    Discountmoney: '',
    actualPrice: '',
    totelPrice: '',
    isAble: 0,
    couponid: '',
    addressId: '',
    isDefault: 0,
    Able: 0,
    addressAdministration: '',
    labelName: '',
    addressType: 0,
    addressIds: 0,
    areaId: 0,
    ispay: '',
    isgopay: true,
    btnText: '',
    exchange: '',
    exchangeBoxShow: false,
    cardType:1,
    confirmSiteType:0, // 收货地址确认弹窗;0-未更改地址、1-已更改过地址 
    confirmSiteShow:false, // 显示收货地址弹窗
    couponPrice:0,
    goodsList:[], // 商品列表
    // 支付方式弹窗
    alertChoseShow:false,
    // 类型选择下标
    typeIndex:1,
    // cardchose 购物车是否选中
    cardchose:false
  },
  // 显示收货弹窗 
  confirmSite(){ 
    this.setData({ 
      confirmSiteShow: true, 
      confirmSiteType: 1 
    }) 
  }, 
  // 加入会员
  join: function(e) {
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },
  // 初始化数据 -- 入口购物车
  order: function() {
    let that = this
    // console.log(that.data.addressIds)
    if (that.data.addressIds == undefined) {
      that.setData({
        addressIds: 0
      })
    }
    if (that.data.addressType == undefined) {
      that.setData({
        addressType: 0
      })
    }
    if (that.data.areaId == undefined) {
      that.setData({
        areaId: 0
      })
    }
    post('/mall/cart/getCartBlanceInfoV4', {
      freightType : 1,
      uid: that.data.uid,
      addressIds: that.data.addressIds,
      addressType: that.data.addressType,
      areaId: that.data.areaId,
      cartId: that.data.cartId
    }, (res) => {
      if (res.data.code == 200) {
        let list = res.data.data
        that.setData({

          // console.log(that.data.addressIds)
          // console.log(that.data.areaId)
          // console.log(that.data.cartId)
          
          list: list,
          isFreeGoods:list.isFreeGoods,
          receiverName: list.address.receiver_name,
          mobile: list.address.mobile,
          address: list.address.province_name + list.address.city_name + list.address.zone_name + list.address.town_name + list.address.address,
          isaddress: list.address,
          totelPrice: list.address.totelPrice,
          couponList: list.coupon,
          goodsList: list.newGoodsList,
          actualPrice: (list.actualPrice + list.totalFreight).toFixed(2),
          totelPrice: list.totelPrice,
          Calculation: list.actualPrice,
          // totelDeducPrice: list.jifen.totelDeducPrice,
          // isAble: list.jifen.isAble,
          addressId: list.address.address_id,
          isDefault: list.address.is_default,
          totalFreight: list.totalFreight,
          balanceMoney: list.balanceMoney*1,
          baMoney: (list.actualPrice - list.balanceMoney).toFixed(2),

          // labelName: list.goodSpec,
          // isShowAddress: list.isShowAddress,
          // remindMessage: res.data.remindMessage
        })
        // 当前配送地址不支持送货
        if (list.isFilterGoods == 1) {
          wx.showToast({
            title: list.isFilterGoodsText,
            icon: 'none'
          })
        }
        // console.log(list.goodsList)
        if (that.data.cartType == 'cartType') {
          // console.log('----')
          that.setData({
            addressIds: list.address.province_id + '_' + list.address.city_id + '_' + list.address.zone_id + '_' + list.address.town_id,
            areaId: list.address.address_id

          })
          // console.log(list.address)
        }
        let couponList = that.data.couponList
        if (couponList != '') {
          that.setData({
            actualPrice: (list.actualPrice - list.coupon[0].amount).toFixed(2),
            couponid: list.coupon[0].couponId,
            baMoney: (list.actualPrice - list.balanceMoney).toFixed(2),
            DiscountAmount: list.coupon[0].couponName,
            Discountmoney: list.coupon[0].amount
          })
          let Nouse = {
            couponName: '不使用优惠劵',
            amount: 0,
            couponId: 0
          }
          couponList.push(Nouse)
        }
        that.setData({
          couponList: couponList
        })
        let goodlist = that.data.goodsList
        for (let i of list.goodsList) {
          if (i.goodsClassify == 0) {
            if (list.address == '') {
              that.setData({
                ispay: '·请添加地址后进行商品预定',
                isgopay: false
              })
            } else {
              for (let i of goodlist) {
                if (i.stockMessage.saleStatus == 1) { //可以购买
                  if (i.stockMessage.stock_num == 0) {
                    if (goodlist.length > 1) {
                      that.setData({
                        ispay: '·至少有一个商品库存不足，请重新选择',
                        isgopay: false
                      })
                    } else {
                      that.setData({
                        ispay: '·该商品库存不足，请重新选择',
                        isgopay: false
                      })
                    }
                  } else {
                    if (that.data.goodNum > i.stockMessage.stock_num) { //可以购买时购买量必须小于库存
                      that.setData({
                        ispay: '该商品库存不足，请重新选择',
                        isgopay: false
                      })
                    } else {
                      that.setData({
                        ispay: '',
                        isgopay: true
                      })
                    }
                  }
                } else {
                  that.setData({
                    ispay: '·该区域不售卖此商品，请重新选择',
                    isgopay: false
                  })
                }
              }
            }
          }
        }
      } else if (res.data.code == 400) {
        // if (that.data.goodid == 450336) {
        //   wx.showToast({
        //     title: '仅非会员可购买此商品',
        //     icon: 'none',
        //     duration: 2200
        //   })
        // } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 10000
        });
        // }
        setTimeout(function() {
          wx.navigateBack()
        }, 6000)

      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  hideRedPacket(){ // 隐藏新人红包
    this.setData({
      showRedPacket: false
    })
  },
  huangou(){ // 新用户去换购
    this.setData({
      showRedPacket: false,
      showCoudanList: true
    })
  },
  edgeCount(){
      if(this.data.goodsCount == 1){
          wx.showToast({
            title: '不能再少了哟',
            icon: 'none'
          })
          return
      }
      let count = this.data.goodsCount
      count--
      this.setData({
        goodsCount: count
      })
  },
  addCount(){
    let count = this.data.goodsCount
    count++
      this.setData({
        goodsCount: count
      })
  },
  hideCoudanList(){ // 隐藏凑单列表
    this.setData({
      showCoudanList: false
    })
  },
  getCouDanList(){ // 获取凑单列表
    post('/mall/getBigGiftBigList', {
      "page": this.data.coudanpage,
      "pageSize": 10,
      "uid": this.data.uid
    },(res) => {
      // console.log(res)
      if(res.data.code == 200){
        if(res.data.data){
          this.setData({
            collage: res.data.data.isCollage,
            hasAddBuy: res.data.data.purchasedCount || 0,
            maxAddBuy: res.data.data.maxPurchasedNumber || 1
          })
          if(!this.data.coudanTotal){
            this.setData({
              coudanTotal: res.data.data.total || 0
            })
          }
          res.data.data.goodsList = res.data.data.goodsList || []
          this.setData({
            coudanList: this.data.coudanList.concat(res.data.data.goodsList)
          })
        }
      }
    }, 1, this.data.token, true, this.data.uid, 4)
  },
  loadMore(){ // 分页加载
    if(this.data.coudanList.length < this.data.coudanTotal - 1){
        this.data.coudanpage++
        this.getCouDanList()
    }
  },
  getSkuDetailMk(e){
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var bol = e.currentTarget.dataset.bol;
    this.getSkuDetail(id,idx,bol)
  },
  changeShow(e){
    var bol = e.currentTarget.dataset.bools
    if(!bol){
      this.setData({
        showGoodsSku: bol,
        statusIndex: 0,
        goodsCount: 1
      })
      return
    }
    this.setData({
      showGoodsSku: bol
    })
  },
  addShopCar(){
    if(this.data.hasAddBuy >= this.data.maxAddBuy){
      wx.showToast({
        title: '已超出最大限制数量',
        icon: 'none'
      })
      return
    }
    post('/mall/cart/createV4',{
      position_from: 0,
      product_id: this.data.coudanList[this.data.goodsIdx].goodsId,
      product_sku_id: this.data.skuids,
      uid: this.data.uid || '',
      product_num: this.data.goodsCount,
      isCollage: this.data.collage
    },(res) => {
      if(res.data.status == 200){
        let count = Number(this.data.hasAddBuy) + Number(this.data.goodsCount)
        this.setData({
          statusIndex: 0,
          goodsCount: 1,
          hasAddBuy: count
        })
        this.getSkuDetail(this.data.skuids,this.data.goodsIdx,false)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, this.data.token, true, this.data.uid, 4)
  },
  getSkuDetail(id,idx,bol){ // 获取规格详情
    post('/mall/getProductBuyDatailV4', {
      uid: this.data.uid || '',
      addressCode: this.data.addressType,
      product_sku_id: id,
      productType: this.data.productType,
      liveId: this.data.liveId * 1,
      live_id: this.data.liveId * 1,
      live_people_id: this.data.liveUserId * 1,
      product_id: this.data.goodid
    }, (res) => {
      if(res.data.code == 200){
        this.setData({
          addInfo: res.data.data || {},
          cartTotal: res.data.data.cartTotal
        })
        if(res.data.data && res.data.data.saleList && res.data.data.saleList.length){
            var data = res.data.data.saleList[0].buttons || []
            if(bol){
                post('/mall/cart/createV4',{
                  position_from: 0,
                  product_id:  this.data.goodid,
                  product_sku_id: this.data.skuid,
                  uid: this.data.uid || '',
                  product_num: this.data.list.goodsList[0].goodNum,
                  joinLocation: 'collage'
                },(res) => {
                  this.setData({
                    guigeList: data,
                    goodsIdx: idx,
                    skuids: data[0].skuList[0],
                    showGoodsSku: bol
                  })
                }, 1, this.data.token, true, this.data.uid, 4)
            }else{
              this.setData({
                guigeList: data,
                goodsIdx: idx,
                showGoodsSku: bol
              })
            }
        }
      }
    }, 1, this.data.token, true, this.data.uid, 4)
  },
  toShopCar(){
    wx.redirectTo({
      url: '/page/Yuemall/pages/Cart/Cart'
    })
  },
  changeGuige(e){
      this.setData({
        statusIndex: e.currentTarget.dataset.idx,
        skuids: e.currentTarget.dataset.guige
      })
  },
  hideMask(){
    this.setData({
      addMask: false
    })
  },
  // 初始化数据  -- 入口详情去购买
  ordergopay: function() {
    let that = this
    if (that.data.labelName == undefined || that.data.labelName == 'undefined') {
      that.setData({
        labelName: ''
      })
    }
    post('/mall/getProuctBlanceInfoV4', {
      freightType : 1,
      product_num: that.data.amountnumber,
      product_id: that.data.goodid,
      uid: that.data.uid,
      addressType: that.data.addressType,
      addressIds: that.data.addressIds,
      areaId: that.data.areaId,
      product_sku_id: that.data.skuid,
      productType: that.data.productType,
      live_id: that.data.liveId * 1,
      live_people_id: that.data.liveUserId * 1
    }, (res) => {
      if (res.data.code == 200) {
        let list = res.data.data
        // console.log(list)
        if(list.isGiftGoods == 1){
          that.setData({
            showRedPacket: true
          })
        }else if(list.isReductionMoney > 0) {
          that.setData({
            addMask: true,
            isReductionMoney: list.isReductionMoney
          })
        }
        that.setData({
          list: list,
          isFreeGoods: list.isFreeGoods,
          cardType: list.identityType,
          receiverName: list.address.receiver_name,
          mobile: list.address.mobile,
          address: list.address.province_name + list.address.city_name + list.address.zone_name + list.address.town_name + list.address.address,
          isaddress: list.address,
          totelPrice: list.address.totelPrice,
          couponList: list.coupon,
          goodsList: list.newGoodsList,
          actualPrice: (list.actualPrice + list.totalFreight).toFixed(2),
          totelPrice: list.totelPrice,
          Calculation: list.actualPrice,
          // totelDeducPrice: list.jifen.totelDeducPrice,
          // isAble: list.jifen.isAble,
          addressId: list.address.address_id,
          isDefault: list.address.is_default,
          totalFreight: list.totalFreight,
          balanceMoney: list.balanceMoney*1,
          baMoney: (list.actualPrice - list.balanceMoney).toFixed(2),
          // labelName: list.goodSpec,
          // isShowAddress: list.isShowAddress,
          // remindMessage: res.data.remindMessage
        })
        // 当前配送地址不支持送货
        if (list.isFilterGoods==1){
          wx.showToast({
            title: list.isFilterGoodsText,
            icon:'none'
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 2000)
        }
        // console.log(couponList != '')
        let couponList = that.data.couponList
        if (couponList != '') {
          that.setData({
            actualPrice: (list.actualPrice - list.coupon[0].amount).toFixed(2),
            baMoney: (list.actualPrice - list.balanceMoney).toFixed(2),
            couponid: list.coupon[0].couponId,
            DiscountAmount: list.coupon[0].couponName,
            Discountmoney: list.coupon[0].amount
          })
          // console.log(that.data.actualPrice)
          let Nouse = {
            couponName: '不使用优惠劵',
            amount: 0,
            couponId: 0
          }
          couponList.push(Nouse)
        }
        that.setData({
          couponList: couponList
        })
        let goodlist = that.data.goodsList
        for (let i of list.goodsList) {
          if (i.goodsClassify == 0) {
            if (list.address == '') {
              that.setData({
                ispay: '·请添加地址后进行商品预定',
                isgopay: false
              })
            } else {
              for (let i of goodlist) {
                if (i.stockMessage.saleStatus == 1) { //可以购买
                  if (i.stockMessage.stock_num == 0) {
                    if (goodlist.length > 1) {
                      that.setData({
                        ispay: '·至少有一个商品库存不足，请重新选择',
                        isgopay: false
                      })
                    } else {
                      that.setData({
                        ispay: '·该商品库存不足，请重新选择',
                        isgopay: false
                      })
                    }
                  } else {
                    if (that.data.goodNum > i.stockMessage.stock_num) { //可以购买时购买量必须小于库存
                      that.setData({
                        ispay: '该商品库存不足，请重新选择',
                        isgopay: false
                      })
                    } else {
                      that.setData({
                        ispay: '',
                        isgopay: true
                      })
                    }
                  }
                } else {
                  that.setData({
                    ispay: '·该区域不售卖此商品，请重新选择',
                    isgopay: false
                  })
                }
              }
            }
          }
        }

      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 10000
        });
        // if (that.data.goodid == 450336) {
        //   wx.showToast({
        //     title: '仅非会员可购买此商品',
        //     icon: 'none',
        //     duration: 2200
        //   })
        // } else {

        // }
        setTimeout(function() {
          wx.navigateBack()
        }, 3000)
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  // 优惠券
  immediateUse: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    // console.log(that.data.Calculation, that.data.couponList[index].amount, that.data.totalFreight)
    that.setData({
      couponid: e.currentTarget.dataset.couponid,
      actualPrice: ((that.data.Calculation - that.data.couponList[index].amount) + that.data.totalFreight).toFixed(2),
      couponPrice: that.data.couponList[index].amount,
      DiscountAmount: that.data.couponList[index].couponName,
      Discountmoney: that.data.couponList[index].amount,
      baMoney: (that.data.actualPrice - that.data.balanceMoney).toFixed(2),
      showModalStatus: false
    })
    // console.log(e.currentTarget.dataset.couponid)
    // if (this.data.pagetype != 'dalibao') {
    //   if (this.data.type == 'gopay') {
    //     post('/app/mall/cart/newBalance', {
    //       goodId: that.data.goodid,
    //       cid: e.currentTarget.dataset.couponid
    //     }, (res) => {
    //       if (res.data.status == 200) {
    //         let list = res.data.data
    //         that.setData({
    //           DiscountAmount: e.currentTarget.dataset.couponname,
    //           showModalStatus: false,
    //           actualPrice: list.actualPrice,
    //           totelPrice: list.totelPrice
    //         })
    //       } else {

    //       }
    //     }, 1, that.data.token, true, that.data.uid)
    //   } else {
    //     post('/app/mall/cart/newBalance', {
    //       cartId: that.data.cartId,
    //       cid: e.currentTarget.dataset.couponid
    //     }, (res) => {
    //       if (res.data.status == 200) {
    //         let list = res.data.data
    //         that.setData({
    //           DiscountAmount: e.currentTarget.dataset.couponname,
    //           showModalStatus: false,
    //           actualPrice: list.actualPrice.toFixed(2),
    //           totelPrice: list.totelPrice
    //         })
    //       } else {

    //       }
    //     }, 1, that.data.token, true, that.data.uid)
    //   }
    // }
  },
  // 抵扣悦豆
  // checkChange: function(e) {
  //   let that = this
  //   if (e.detail.value.length == 0) {
  //     that.setData({
  //       Able: 0
  //     })
  //     if (that.data.type == 'gopay') {
  //       post('/app/mall/cart/newBalance', {
  //         goodId: that.data.goodid,
  //         isUseIntegral: that.data.Able,
  //         cid: that.data.couponid,
  //         goodNum: that.data.amountnumber
  //       }, (res) => {
  //         if (res.data.status == 200) {
  //           let list = res.data.data
  //           that.setData({
  //             actualPrice: list.actualPrice,
  //             totelPrice: list.totelPrice,
  //             // Able: 1
  //           })
  //         } else {}
  //       }, 1, that.data.token, true, that.data.uid)
  //     } else {
  //       post('/app/mall/cart/newBalance', {
  //         cartId: that.data.cartId,
  //         isUseIntegral: that.data.Able,
  //         cid: that.data.couponid
  //       }, (res) => {
  //         if (res.data.status == 200) {
  //           let list = res.data.data
  //           that.setData({
  //             actualPrice: list.actualPrice,
  //             totelPrice: list.totelPrice,
  //             // Able: 1
  //           })
  //         } else {}
  //       }, 1, that.data.token, true, that.data.uid)
  //     }
  //   } else {
  //     // that.setData({
  //     //   Able: 1
  //     // })
  //     if (that.data.type == 'gopay') {
  //       post('/app/mall/cart/newBalance', {
  //         goodId: that.data.goodid,
  //         isUseIntegral: that.data.Able,
  //         cid: that.data.couponid,
  //         goodNum: that.data.amountnumber
  //       }, (res) => {
  //         if (res.data.status == 200) {
  //           let list = res.data.data
  //           that.setData({
  //             actualPrice: list.actualPrice,
  //             totelPrice: list.totelPrice
  //           })
  //         } else {}
  //       }, 1, that.data.token, true, that.data.uid)
  //     } else {
  //       post('/app/mall/cart/newBalance', {
  //         cartId: that.data.cartId,
  //         isUseIntegral: that.data.Able,
  //         cid: that.data.couponid
  //       }, (res) => {
  //         if (res.data.status == 200) {
  //           let list = res.data.data
  //           that.setData({
  //             actualPrice: list.actualPrice,
  //             totelPrice: list.totelPrice
  //           })
  //         } else {}
  //       }, 1, that.data.token, true, that.data.uid)
  //     }
  //   }
  // },
  // 支付
  payment: function() {
    let that = this
    // if (that.data.confirmSiteType==0){ 
    //   that.confirmSite() 
    //   return 
    // } 
    if (that.data.leaderId == undefined || that.data.leaderId == 'undefined') {
      that.setData({
        leaderId: 0
      })
    }
    // console.log(that.data.isaddress, 'that.data.isaddress')
    that.setData({
      isgopay: false
    })
    if (that.data.type == 'gopay') {
      for (let i of that.data.list.goodsList) {
        if (i.goodsClassify == 0) {
          if (that.data.isaddress == '') {
            wx.showToast({
              title: '至少添加一个收货地址',
              icon: 'none'
            })
            return false
          }
        }
      }
      wx.showLoading({
        title: '请稍等',
      });
      let obj = {
        type: 3,
        cid: that.data.couponid,
        product_num: that.data.amountnumber,
        product_id: that.data.goodid,
        product_sku_id: that.data.skuid,
        uid: that.data.uid,
        addressType: that.data.addressType,
        addressIds: that.data.addressIds,
        live_id: that.data.liveId*1,
        live_people_id: that.data.liveUserId*1,
        areaId: that.data.areaId,
        shareId: wx.getStorageSync('ortherReCode'),
        productType: that.data.productType,
        isHadBalance: 1,
        freightType : 1,
        share_form:app.globalData.shareForm,
        position_from:app.globalData.positionFrom
      }
      if (that.data.video == 'video') {
        obj.orderFrom = 11
      } else if (that.data.video == 'zhibo') {
        obj.orderFrom = 12
      } else {
        obj.orderFrom = 7
      }
      post('/mall/createOrderByProductV4', obj, (res) => {
        if (res.data.code == 200) {
          that.setData({
            ordersn: res.data.ordersn
          })
          wx.hideLoading()
          if(this.data.typeIndex=='1'){
            post('/app/newMallPay', {
              ordersn: res.data.ordersn,
              type: 3,
              
            }, (res) => {
              if (res.data.code == 200) {
                wx.hideLoading()
                wx.showLoading({
                  title: '支付中',
                });
                wx.requestPayment({
                  'timeStamp': res.data.pay.getwayBody.timeStamp,
                  'nonceStr': res.data.pay.getwayBody.nonceStr,
                  'package': res.data.pay.getwayBody.package,
                  'signType': 'MD5',
                  'paySign': res.data.pay.getwayBody.paySign,
                  'success': function (res) {
                    wx.hideLoading()
                    wx.showToast({
                      title: '支付成功',
                      icon: 'none'
                    })
                    if (that.data.pagetype == 'dalibao') {
                      wx.redirectTo({
                        url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + true + '&payType=0' + '&typePage=' + that.data.pagetype + '&Mywinning=' + 'dalibao'
                        //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
                      })
                    } else {
                      wx.redirectTo({
                        url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + true + '&payType=0' + '&address=' + that.data.address + '&mobile=' + that.data.mobile + '&receiverName=' + that.data.receiverName
                        //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
                      })
                      // console.log('address')
                    }
                  },
                  'fail': function (res) {
                    wx.hideLoading()
                    wx.redirectTo({
                      url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + false + '&payType=0' + '&Mywinning=' + that.data.pagetype + '&address=' + that.data.address + '&mobile=' + that.data.mobile + '&receiverName=' + that.data.receiverName
                      //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
                    })

                  },
                })
              }
            }, 1, that.data.token, true, that.data.uid)
          }else{
            if (res.data.isHasPayWord == 1) {
              wx.showToast({
                title: '请先到我的钱包-消费余额中设置密码',
                icon: 'none',
                duration: 5000
              });
              that.setData({
                alertChoseShow: false,
                isgopay: true
              })
              return
            }
            that.setData({
              alertShow: true,
              alertChoseShow: false,
              isgopay: true
            })
            wx.hideLoading()
          }
        } else if (res.data.code == 400) {
          that.setData({
            isgopay: true
          })
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }, 1, that.data.token, true, that.data.uid, 4)
    } else {
      if (that.data.isaddress == '' && that.data.goodsClassify == 0) {
        wx.showToast({
          title: '至少添加一个收货地址',
          icon: 'none'
        })
        return false
      }
      // console.log(this.data.cardchose)
      // if (!this.data.cardchose){
      //   this.toPay()
      //   this.setData({
      //     cardchose:true
      //   })
      //   return
      // }
      wx.showLoading({
        title: '支付中',
      });
      post('/mall/createOrderByCartV4', {
        freightType : 1,
        type: 3,
        uid: that.data.uid,
        addressIds: that.data.addressIds,
        addressType: that.data.addressType,
        areaId: that.data.areaId,
        cartId: that.data.cartId,
        cid: that.data.couponid,
        shareId: wx.getStorageSync('ortherReCode'),
        orderFrom: 7,
        isHadBalance:1,
        share_form:app.globalData.shareForm,
        position_from:app.globalData.positionFrom
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            ordersn: res.data.ordersn
          })
          // console.log(this.data.typeIndex)
          if(this.data.typeIndex=='1'){
            post('/app/newMallPay', {
              ordersn: res.data.ordersn,
              type: 3
            }, (res) => {
              if (res.data.code == 200) {
                // console.log(res)
                wx.requestPayment({
                  'timeStamp': res.data.pay.getwayBody.timeStamp,
                  'nonceStr': res.data.pay.getwayBody.nonceStr,
                  'package': res.data.pay.getwayBody.package,
                  'signType': 'MD5',
                  'paySign': res.data.pay.getwayBody.paySign,
                  'success': function (res) {
                    wx.hideLoading()
                    wx.showToast({
                      title: '支付成功',
                      icon: 'none'
                    })
                    wx.redirectTo({
                      url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + true + '&payType=0',
                      //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
                    })
                  },
                  'fail': function (res) {
                    wx.hideLoading()
                    wx.redirectTo({
                      url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + false + '&payType=0',
                      //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
                    })
                  },
                })
              }
            }, 1, that.data.token, true, that.data.uid)
          
          }else{
            // console.log(res.data.isHasPayWord)
            if (res.data.isHasPayWord == 1) {
              wx.showToast({
                title: '请先到我的钱包-消费余额中设置密码',
                icon: 'none',
                duration: 5000
              });
              that.setData({
                isgopay: true,
                alertChoseShow: false,
              })
              return
            }
            that.setData({
              alertShow: true,
              alertChoseShow:false,
              isgopay: true
            })
            wx.hideLoading()
          }
        
        } else {

        }
      }, 1, that.data.token, true, that.data.uid, 4)
    }
  },
  // 添加地址
  addressAdministration: function() {
    wx.navigateTo({
      url: '../addressAdministration/addressAdministration',
    })
  },
  //凑单商品列表
  goCoulist:function(){
    let e = this.data.addInfo
    post('/mall/cart/createV4', {
      product_id: e.product_id,
      product_sku_id:this.data.skuid,
      uid: wx.getStorageSync('uid'),
      position_from:0,
      product_num:this.data.amountnumber,
      isCollage:0
    }, (res) => {
      console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '加入成功',
          icon: "none"
        })
        this.setData({
          isFreeGoods:0
        })  
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    wx.navigateTo({
      url: '../Coulist/Coulist',
    })
  },
  // 显示弹窗
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
  //hongbao
  closeRedbag:function(){
    this.setData({
      isFreeGoods:0
    })
  },
  // 隐藏弹窗
  hideModal: function() {
    this.setData({
      showModalStatus: false
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
  },
  // 优惠券
  coupon: function() {
    this.showModal();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options,'查看页面传入值')
    let that = this
    let Modeliphonex = 'iPhone X'
    let ModeliphonePro = 'iPhone Pro'
    // console.log(options)
    this.setData({
      pagetype: options.pagetype,
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      cartId: options.cartId,
      amountnumber: options.amountnumber,
      goodid: options.goodid,
      type: options.type,
      addressAdministration: options.addressAdministration,
      labelName: options.labelName,
      // cardType: wx.getStorageSync('cardType'),
      leaderId: options.leaderId,
      skuid: options.skuid,
      addressIds: options.addressIds,
      addressType: options.addressType,
      areaId: options.areaId,
      cartType: options.cartType,
      ismodify: options.ismodify,
      productType: options.productType,
      productId: options.productId,
      liveId: options.liveId,
      liveUserId: options.liveUserId,
      video: options.video, //是否是视频中进入的  video 是
      cardType: wx.getStorageSync('cardType'),
    })
    this.getCouDanList()
    this.getSkuDetail(this.data.skuid,0,false)
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
        // console.log(res.model)
        if (res.model.indexOf(Modeliphonex) > -1 || res.model.indexOf(ModeliphonePro) > -1) {
          // console.log('---')
          that.setData({
            isFill: true
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // if (this.data.cardType == 0) {
    //   this.setData({
    //     Able: 0
    //   })
    // } else {
    //   this.setData({
    //     Able: 1
    //   })
    // }
    if (this.data.addressAdministration == 'addressAdministration') {

    } else {
      if (this.data.type == 'gopay') {
        this.ordergopay()
      } else {
        this.order()
      }
    }
    this.setData({
      addressAdministration: ''
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  // 兑换弹框
  exchangeBox: function() {
    this.setData({
      exchangeBoxShow: !this.data.exchangeBoxShow
    })
  },
  // 兑换接口t
  exchange: function() {
    let that = this

    post('/mall/card/exchange', {
      "mid": that.data.uid,
      "productId": that.data.goodid,
      "productSkuId": that.data.skuid,
      "addressId": that.data.areaId,
      "cid": that.data.couponid
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          ordersn: res.data.ordersn
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          success: function() {
            setTimeout(function() {
              wx.switchTab({
                url: '/page/EliteCard/EliteCard'
              })
            }, 2000)
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.data.ismodify == 'ismodify') {
      // wx.navigateBack({
      //   delta: 2
      // })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // 点击修改密码
  updatePassword() {
    this.setData({
      alertShow: true,
      comIndex: 0
    })
    // 调用子级的倒计时
    this.selectComponent('#myCode').countdownFun()
  },
  // 子组件点击下一步事件
  nextAlert(e) {
    // console.log(e.detail)
    this.setData({
      comIndex: e.detail
    })
  },
  // 开始转入
  intoStart(e) {
    let that = this
    post('/app/mall/order/balancePay', {
      "orderNo": this.data.ordersn,  //订单
      "word": this.data.password //密码
    }, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        wx.showToast({
          title: '支付成功',
          icon: 'none'
        })
        wx.hideLoading()
        wx.redirectTo({
          url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + true + '&payType=0',
          //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        if (res.data.msg == '密码错误') {
          return
        }
        that.setData({ isgopay: true })
        let type = ''
        if (that.data.type == 0) {
          type = 'miaosha'
        } else if (that.data.type == 1) {
          type = 'banjia'
        }
        // console.log(type)
        wx.redirectTo({
          url: '/page/other/pages/PayResults/PayResults?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + false + '&payType=0' + '&malltype=' + type,
          //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1, 'aes')
  },
  // 右上角关闭
  closeMyself() {
    if (this.data.type == 'gopay') {
      this.setData({
        alertShow: false
      })
    } else {
      this.setData({
        alertShow: false
      })
      wx.showToast({
        title: '订单已取消',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    }
  },
  // 下一步
  nextAlert() {
    if (this.data.password.length != 6) {
      wx.showToast({
        title: '请输入6位密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '支付中',
    });
    this.intoStart()
    // this.triggerEvent('into', this.data.password)
    // this.triggerEvent('nextCom', 2)
  },
  // 输入密码
  setPsw(e) {
    this.setData({
      password: e.detail.value
    })
  },
  closeTypeAlert() {
    this.setData({
      alertChoseShow: false,
      cardchose: false,
      isgopay: true
    })
  },
  // 去支付
  toPay() {
    wx.hideLoading()
    if (this.data.address == 'NaNundefined') {
      wx.showToast({
        title: '至少添加一个收货地址',
        icon: 'none'
      })
      return false
    }
    this.setData({
      alertChoseShow: true,
      confirmSiteShow: false
    })
  },
  // 
  choseType(e) {
    var index = e.currentTarget.dataset.index
    // console.log(this.data.balanceMoney > this.data.actualPrice)
    if (this.data.balanceMoney * 1 < this.data.actualPrice * 1 && index == '2') {
      wx.showToast({
        title: '余额不足，请选择其他支付方式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      typeIndex: index
    })
  },
  // 关闭地址弹窗
  closeConfirm() {
    this.setData({
      confirmSiteShow: false
    })
  }
})