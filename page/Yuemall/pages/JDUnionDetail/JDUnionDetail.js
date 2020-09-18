import {
  get,
  post,
  retrunScene
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id:'',
    uid:'',
    token:'',
    goodsInfo:{},
    channelIcon:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-02-23/09/yuelvhuiI9ee3xGzmq1582420967.png',
    shareData:{},
    authorizationStatus:true
  },
  sharePage:function(){
    wx.navigateTo({
      url: '/page/other/pages/CommoditySharing/CommoditySharing?goodsid=' + this.data.goods_id + '&Entrance=' + 'jd' + '&amount=' + this.data.goodsInfo.coupon.discount + '&price=' + this.data.goodsInfo.original_price + '&goodsName=' + this.data.goodsInfo.goods_name + '&vipPrice=' + this.data.goodsInfo.jd_price + '&saleCount=' + this.data.goodsInfo.sale_num
    })
  },

  Jumpgrowthvalue(e){
    console.log(e)
    wx.navigateTo({
      url: '/page/Yuemall/pages/GrowthDetails/GrowthDetails',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    let codeNumber, goods_id
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        codeNumber = sceneObj.C;
        goods_id = sceneObj.G;
      });
    } else {
      codeNumber = options.codeNumber;
      goods_id = options.goods_id;
    }
    this.setData({
      goods_id: goods_id,
      codeNumber: codeNumber,
      token: wx.getStorageSync('token')
    })
  },

  onShow(){
    if (wx.getStorageSync('uid')) {
      this.setData({
        authorizationStatus: false
      })
    } else {
      this.VerificationCode()
    }
    this.setData({
      uid: wx.getStorageSync('uid')
    })
    this.getDetailData()
    this.share()
  },

  getDetailData(){
    let that=this,
      data={
        goods_id: this.data.goods_id,
        uid: this.data.uid,
        type:2
      }
    post('/outside/jdGoodsInfo', data, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        console.log(res.data.data.newShareScore,"111111")
        that.setData({
          goodsInfo: res.data.data,
          newShareScore:res.data.data.newShareScore
        })
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, this.data.token, true, this.data.uid, 4)
  },

  share(){
    let that = this,
      data = {
        goods_id: this.data.goods_id,
        uid: this.data.uid,
        type: 4 // 分享类型1海报 2，3 分享h5 4 分享到好友 （跳小程序
      }
    post('/outside/jdGoodsShare', data, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          shareData: res.data.data
        })
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, this.data.token, true, this.data.uid, 4)
  },

  // 手机号验证码
  VerificationCode: function () {
    let that=this
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber='+that.data.codeNumber
    })
  },

  go(){
    let that=this
    wx.navigateToMiniProgram({
      appId: 'wx13e41a437b8a1d2e',
      path: that.data.goodsInfo.xcx_jump,
      extraData: {

      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})