import {
  get,
  post,
  relations,
  retrunScene,
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getData(){
    let that=this,
      data={
        mid:wx.getStorageSync('uid')
      }
    post('/taobk/v1/createSmallProgramV2', data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          bg: res.data.data.bg,
          button: res.data.data.elmCps.button,
          path: res.data.data.elmCps.path,
          share: res.data.data.share.button,
          shareInfo: res.data.data.share,
          sm: res.data.data.sm
        })
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, this.data.token, true, this.data.uid, 6)
  },

  go(){
    let that=this
    console.log(that.data.path)
    wx.navigateToMiniProgram({
      appId: 'wxece3a9a4c82f58c9',
      path: that.data.path,
      extraData: {

      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  goShare() {
    
  },
  // 手机号验证码
  VerificationCode: function () {
    let that=this
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber' + that.data.codeNumber
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow(){
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
        relations(sceneObj.C);
        that.setData({
          codeNumber: sceneObj.C
        })
      });
    } else if (options.reCode) {
      relations(options.reCode);
      that.setData({
        codeNumber: options.reCode
      })
    }
    
    if (wx.getStorageSync('uid')) {
      this.getData()
    } else {
      this.VerificationCode()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '悦淘联合饿了么发福利啦，领券点外卖，买菜不出门，最高可领31元',
      path: '/page/Yuemall/pages/ELM/ELM?reCode=' + wx.getStorageSync('selfReCode')
    }
  } 
})