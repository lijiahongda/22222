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
    channelIcon:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-03-07/14/yuelvhuiTi3Ybdsx771583562505.png',
    shareData:{},
    authorizationStatus:true
  },
  WPHClick(e){
    console.log(e)
    wx.navigateTo({
      url: '/page/Yuemall/pages/GrowthDetails/GrowthDetails',
    })
  },
  sharePage: function () {
    wx.navigateTo({
      url: '/page/other/pages/CommoditySharing/CommoditySharing?goodsid=' + this.data.goods_id + '&Entrance=' + 'wph'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
  },

  getDetailData(){
    let that=this,
      data={
        goods_id: this.data.goods_id,
        uid: this.data.uid,
        // channel_id:100,
        type:3
      }
    post('/outside/wph/getGoodDetail', data, (res) => {
      console.log(res)
      if (res.data.code == 200) {
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
      appId: 'wxe9714e742209d35f',
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