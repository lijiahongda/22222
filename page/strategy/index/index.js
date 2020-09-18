import {
  get,
  post,
  relations
} from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps:0, // 当前选项
    shareData:{},
    subBotton:'等待审核',
    status:[],
    hGroup:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token')
    })
    //扫码参数分解
    let reCode = ''
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        reCode = sceneObj.R;
      });
    } else {
      reCode = options.reCode;
    }
    this.setData({
      reCode
    })
    if (wx.getStorageSync('uid')) {
      
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber=' + this.data.codeNumber
      })
    }
    this.sharePage()
  },
  onShow(){
    this.getData()
    this.getGData()
  },
  // 改变步骤
  changeSteps(e){
    console.log(e)
    this.setData({
      steps:e.currentTarget.dataset.steps
    })
  },
  sharePage() {
    let that = this
    // 刷新个人信息
    post('/community/groupRule/shareXcx', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          shareData: res.data.data
        })
      }
    }, 1, this.data.token, true, this.data.uid, 1)
  },
  // 前往群助手
  goGroup() {
    wx.navigateTo({
      url: '/page/community/pages/myGroup/myGroup',
    })
  },
  // 获取权限
  getData() {
    let that = this
    let data = {
      source: 1
    }
    post('/community/groupRule/raidersNewList', data, (res) => {
      wx.hideLoading()
      let list = res.data.data
      if (res.data.code == 200) {
        that.setData({
          status: list[0].status
        })
      }
    }, 1, this.data.token, true, this.data.uid, 1)
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

  // 分享
  onShareAppMessage(){
    return {
      title: this.data.shareData.title,
      imageUrl: this.data.shareData.showImg,
      path: this.data.shareData.posterUrl
    }
  },
  // 点击按钮
  subBotton(){
    if(this.data.status==0){
      wx.navigateTo({
        url: '/page/community/pages/groupUp/groupUp?status=' + this.data.status
      })
    } else if(this.data.status == 1){

    } else if (this.data.status == 2) {

    }else{
      wx.navigateTo({
        url: '/page/community/pages/groupUp/groupUp?status=' + this.data.status
      })
    }
  },

  getGData() {
    let that = this,
      data = {
        type: '1',  //列表类型 1直推群 2间推群
        page: 1, //页数
        pageSize: 10, //一页展示数
        mid: wx.getStorageSync('uid'),
        source: 1,
      }
    post('/api/community/groupRule/groupList', data, (res) => {
      if (res.data.code == 200) {
        var list = res.data.data.list
        // that.setData({
        //   data: res.data.data,
        //   list: res.data.data.list
        // })
        for (let i in list){
          if(list[i].status==2){
            this.setData({
              hGroup: true
            })
          }
        }
        console.log(this.data.hGroup)
      }
    }, 1, this.data.token, true, this.data.uid, 8)
  }

})