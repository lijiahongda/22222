// page/other/pages/PayResults/PayResults.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    GiftPackageStatus: false,
    isPaySuccess: 'false',
    vipResult:false,
    orderNo: '11715958602556545',
    hotelType: 1, //酒店类型 支付时使用 , 后来老陈说不需要了 以后可能会用到 
    payType: '', // 支付类型 商城 0  酒店 1 线路 2 定制游 3 会员卡 4
    balance:'', // 小琪说这个用来判断什么东西的 问小琪
    orderPrice: '', // 订单价格
    orderCode: '', // 订单编号
    orderTime: '', // 创建时间
    uid: '', //不需要解释
    token: '', //不需要解释
    icon: '',//支持成功icon
    codeBgImage: '',//背景图
    mechanismId:'',//获取优惠券传的ID
    isShowaddress:false,
    showHappy:false,
    firstblod:0
  },
  // 返回首页
  goHome(){
    wx.switchTab({
      url: '/page/Mall/YueMall',
    })
  },
  // 前往订单详情
  orderDetail(){
    wx.navigateTo({
      url: '/page/Yuemall/pages/NeworderList/NeworderList?cur=0',
    })
  },
  closeHappy(){
    this.setData({
      showHappy:false
    })
  },
  go(e){
    app.classificationList(e, this)
  },
  closeisredPopup:function(){
    this.setData({
      isShowaddress:false
    })
  },
  close:function(){
    this.setData({
      GiftPackageStatus:false
    })
  },
  Maddress:function(){
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/addressAdministration/addressAdministration?Mywinning='+'dalibao' + '&orderNo=' + that.data.orderNo
    })
  },
  // 确认填写地址
  sure: function () {
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/addressAdministration/addressAdministration?Mywinning=' + that.data.Mywinning + '&orderNo=' + that.data.orderNo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token')
    })
    let that = this
    that.setData({
      // orderNo: options.orderNo,
      orderNo:'11715958602556545',
      isPaySuccess: options.isSuccess,
      payType: options.payType,
      balance: options.balance,
      malltype: options.malltype,
      Mywinning: options.Mywinning,
      typePage: options.typePage,
      address: options.address,
      mobile: options.mobile,
      receiverName: options.receiverName,
      id:options.id,
      type:options.type,
      islive: options.islive
    })
    console.log(options.id, options.type, options.Mywinning)
    console.log(options,'opeeeee')
    that.getOrderdetaile()
    that.prevUpadateGoods()
    if (that.data.isPaySuccess == 'true') {
      that.getDrawCode()
      that.getOrderdetaile()
      if (that.data.Mywinning == 'dalibao'){
        setTimeout(function () {
          that.setData({
            showHappy: true
          })
        }, 1000)
      }
    }
    // 积分商城
    if (options.payType==5){
      that.getBean()
    }
    // if (options.typePage == 'dalibao'){
    //   that.setData({
    //     GiftPackageStatus: true
    //   })
    // }
    if (options.islive==1){
      
    }else{
      this.initData()
    }
  },
  initData: function () {
    let that = this
    get('/hd/assemble?page=' + 1 + '&channel=' + 7, {}, (res) => {
      if (res.data.code == 200) {
        this.selectComponent("#lineTwoListFlow")._onOption(res.data.data.item)
        console.log(res)
      } else { }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  closeBox:function(){
    this.setData({
      displayType:0
    })
  },
  // 积分商城
  getBean:function(){
    let that = this
    let url = '/app/mall/getOrderDetail'
    post(url, {
      ordersn: that.data.orderNo
    }, res => {
      console.log(res)
      if (res.data.status == 200) {
        wx.hideLoading()
        that.setData({
          orderPrice: res.data.orderPrice ? res.data.coin + '悦豆+¥' + res.data.orderPrice : res.data.coin + '悦豆',
          orderCode: res.data.ordersn,
          orderTime: res.data.orderTime,
          isPaySuccess: 'true',
        })
        console.log(res.data.mechanismId)
        if (res.data.mechanismId != '' && res.data.payStatus == 1 ) {
          console.log(res.data.mechanismId)
          that.selectComponent("#couponPopup")._onOption(res.data.mechanismId)
        } else {
          
        }
      }
      else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 获取支付成功后活动
   */
  getOrderdetaile(){
    let that = this
    let url = '/app/mall/getOrderDetailV4'
    post(url,{ordersn:that.data.orderNo},res=>{
        console.log(res.data)
        that.setData({
          displayType:res.data.displayType,
          tipsImg:res.data.tipsImg,
          mechanismId:res.data.mechanismId,
          shareData:res.data.shareData
        })
        if(res.data.displayType==2){
          that.getSharelistto()
        }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  // 活动查询数据
  getSharelistto:function(){
    let that = this
    let url = '/share/MallProductShareV4'
    post(url,{
      mid:wx.getStorageSync('uid'),
      product_id:that.data.shareData.productId,
      product_sku_id:that.data.shareData.productSkuId
    },res=>{
        console.log(res.data)
        that.setData({
          shareDatapou:res.data.data
        })
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'),4)
  },
  /**
   * 获取支付成功后抽奖码
   */
  getDrawCode(){
    let that = this
    let url = `/app/member/prize/getConsumerCode/${that.data.orderNo}`
    get(url,{},res=>{
      if(res.data.code == 200){
        wx.hideLoading()
        that.setData({
          codeList: res.data.data,
          icon: res.data.icon,
          codeBgImage: res.data.codeBgImage,
          isPaySuccess: 'true',
        })
      }
      else if(res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  luckCode(e){// 查看抽奖码
    wx.navigateTo({
      url:'/page/other/pages/LuckyDrawType/LuckyDrawType?type='+e.currentTarget.dataset.type +'&text='+e.currentTarget.dataset.text
    })
  },
  // 查看订单详情
  prevUpadateGoods(){
    let that = this
    // payType = 0 商城 = 1 酒店 = 2 线路 = 3 定制游 = 4 会员卡
    // 无论 订单支付成功 都执行下面方法
    if(that.data.islive==1){
      // 大人商品
      post('/mall/recommendGoods', {
        uid: wx.getStorageSync('uid'),
        product_id: ''
      }, (res) => {
        if (res.data.code == 200) {
          this.setData({
            initlist: res.data.data
          })
          this.selectComponent("#lineTwoListFlow")._onOption(res.data.data)
          console.log(res)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
         }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 7)
      return
    }
    if (that.data.payType == 0 ){
      //调取商城订单详情数据
      post('/app/mall/getOrderDetailV4', { ordersn: that.data.orderNo}, (res) => {
        console.log(res,'---++++---')
        that.setData({
          orderPrice: res.data.orderPrice,
          orderCode: res.data.ordersn,
          orderTime: res.data.orderTime,
          mechanismId: res.data.mechanismId,
          statusresult: res.data.type,
          displayType:res.data.displayType
        })
        // 0-不显示，1白金，2黑金
        if(res.data.type==1||res.data.type==2){
          that.setData({
            vipResult:true
          })
        }
        if (res.data.mechanismId != '' && res.data.payStatus == 1) {
          console.log(res.data.mechanismId)
          that.selectComponent("#couponPopup")._onOption(res.data.mechanismId)
        } else {

        }
        if (res.data.status == 200) {
          
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
        }
      }, 1, that.data.token, true, that.data.uid)
    }
    else if (that.data.payType == 1){
      //调取酒店订单详情数据
      get('/app/member/hotelOrderDetail/' + that.data.orderNo, {}, (res) => {
        if (res.data.code == 200) {
          that.setData({
            orderCode: res.data.data.ordersn,
            orderTime: res.data.data.createTime,
            orderPrice: res.data.data.discountPrice,
          })
        } else { 
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
      }, 1, that.data.token, true, that.data.uid)
    }
    else if (that.data.payType == 2) {
      //调取线路订单详情数据
      get('/api/order/orderDetails' + that.data.orderNo, {}, (res) => {
        if (res.data.code == 200) {
          that.setData({
            orderCode: res.data.data.orderSn,
            orderTime: res.data.data.orderAt,
            orderPrice: res.data.data.orderPrice,
          })
        } else { 
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
      }, 1, that.data.token, true, that.data.uid,2)
    }
    else if (that.data.payType == 3) {
      //调取定制游订单详情数据

    }
    else if (that.data.payType == 4) {
      //调取会员卡订单详情数据
    }
  },
  Iknow(){
    this.setData({
      vipResult:false
    })
  },
  // 去支付
  goOrderPay(){
    let that = this
    wx.showLoading({
      title: '加载中',
    });
    // payType = 0 商城 = 1 酒店 = 2 线路 = 3 定制游 = 4 会员卡
    if (that.data.payType == 0){
      post('/app/newMallPay', {
        type: 3,
        ordersn: that.data.orderNo
      }, (res) => {
        if (res.data.code == 200) {
          that.selectComponent("#couponPopup")._onOption(that.data.mechanismId)
          wx.requestPayment({
            'timeStamp': res.data.pay.getwayBody.timeStamp,
            'nonceStr': res.data.pay.getwayBody.nonceStr,
            'package': res.data.pay.getwayBody.package,
            'signType': 'MD5',
            'paySign': res.data.pay.getwayBody.paySign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功',
                icon: 'none'
              })
              if (that.data.Mywinning == 'dalibao') {
                that.setData({
                  GiftPackageStatus: true
                })
              } 
              if (that.data.Mywinning == 'tuanzhangmianna'){
                wx.redirectTo({
                  url: "/page/assembleFree/page/InitiateGroup/InitiateGroup?id=" + that.data.id + ' & type=' + that.data.type,
                })
              }
              //获取抽奖码
              // that.getDrawCode()
            },
            'fail': function (res) {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
              // if (that.data.Mywinning == 'dalibao') {
              //   that.setData({
              //     GiftPackageStatus: true
              //   })
              // } 
              that.setData({
                isPaySuccess: 'false'
              })
            },
          })
        } else if (res.data.status == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          that.setData({
            isPaySuccess: 'false'
          })
        }
      }, 1, that.data.token, true, that.data.uid)
    }
    else if (that.data.payType == 1){
      var payUrl = "/app/v1/hotel/order/pay";
        var payObj = {
          ordersn: that.data.orderNo,
          payType: 3, //支付类型3
        }
        get(payUrl, payObj, (res) => {
          if (res.data.code === 200) {
            wx.requestPayment({
              'timeStamp': res.data.pay.getwayBody.timeStamp,
              'nonceStr': res.data.pay.getwayBody.nonceStr,
              'package': res.data.pay.getwayBody.package,
              'signType': 'MD5',
              'paySign': res.data.pay.getwayBody.paySign,
              'success': function (res) {
                wx.showToast({
                  title: '支付成功！',
                  icon: 'success',
                  duration: 2000
                })
                //获取抽奖码
                that.getDrawCode()
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
                that.setData({
                  isPaySuccess: 'false'
                })
              }
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            that.setData({
              isPaySuccess: 'false'
            })
            that.prevUpadateGoods()
          }
        }, 1, that.data.token, true, that.data.uid);
    }
    else if (that.data.payType == 2){
        var payUrl = '/api/pay/send/' + that.data.orderNo + '/XCX';
        //获取支付参数
        get(payUrl, {}, (res) => {
          if (res.data.code === 200) {
            wx.showToast({
              title: '支付。。。',
              icon: 'success',
              duration: 1000
            })
            //支付
            wx.requestPayment({
              'timeStamp': res.data.data.getwayBody.timeStamp,
              'nonceStr': res.data.data.getwayBody.nonceStr,
              'package': res.data.data.getwayBody.package,
              'signType': 'MD5',
              'paySign': res.data.data.getwayBody.paySign,
              'success': function (res) {
                wx.showToast({
                  title: '支付成功！',
                  icon: 'success',
                  duration: 2000
                })
                //获取抽奖码
                that.getDrawCode()
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
                that.setData({
                  isPaySuccess: 'false'
                })
              }
            });
          } else {
            wx.showToast({
              title: '获取支付参数失败！',
              icon: 'none',
              duration: 1000
            })
          }
      }, 1, that.data.token, true, that.data.uid,2);
    }
  },
  //查看其他订单列表
  goToorderList(){
    let that = this
    // payType = 0 商城 = 1 酒店 = 2 线路 = 3 定制游 = 4 会员卡
    if(that.data.payType == 0){
      if (that.data.malltype == 'miaosha'){
        wx.navigateTo({
          url: '/page/Yuemall/pages/HalfPriceOrder/HalfPriceOrder?orderType='+3,
        })
      } else if (that.data.malltype == 'banjia') {
        wx.navigateTo({
          url: '/page/Yuemall/pages/HalfPriceOrder/HalfPriceOrder?orderType=' + 4,
        })
      } else if (that.data.malltype == 'kanjia'){
        wx.navigateTo({
          url: '/page/Yuemall/pages/MyHelp/MyHelp',
        })
      }else{
        wx.navigateTo({
          url: '/page/Yuemall/pages/NeworderList/NeworderList?balance=' + 'balance'+'&cur='+0
        })
      }
    }
    else if(that.data.payType == 1){
      wx.navigateTo({
        url: '/page/hotel/pages/hotelOrder/hotelOrder?balance=' + 'balance' 
      })
    }
    else if(that.data.payType == 3){
      wx.navigateTo({
        url: '/page/yueMember/pages/CustomTourOrder/CustomTourOrder?balance=' + 'balance' 
      })
    }
    else if(that.data.payType == 4){
      wx.navigateTo({
        url: '/page/yueMember/pages/memberOrder/memberOrder?balance=' + 'balance' 
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function () {
    let that = this
    let _data = that.data.shareDatapou;
    that.setData({
      firstblod:1
    })
      return {
        title: _data.tips,
        imageUrl: _data.img,
        path: _data.redirectUrl
      }

  }
})