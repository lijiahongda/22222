// page/Mall/pages/HaggleList/HaggleList.js
import {
  post,
  retrunScene,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    type:'line',
    activities:[],
    twoIndex:0,
    sharelayer: false,
    activityId:'',
    shareTitle: '',
    shareImg: '',
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.dataList()
  },
  onShow: function () {
    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    //扫码参数分解
    if (options.scene != null) {
      console.log(options)
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        that.setData({
          activityId: sceneObj.I
        })
        relations(sceneObj.C);
        console.log(sceneObj.C)
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
  },
  dataList: function () {
    let that = this
    wx.showLoading()
    post('/mall/V2/newMustBuy', {}, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.selectComponent("#banner")._onOption(res.data.data.banner, '#fff', '712', '304') //传banner
        that.setData({
          activities: res.data.data.activities,
          activityId: res.data.data.activities[0].id
        })
        this.postShareImg(that.data.activityId)
        post('/mall/V3/newActivityList', {
          id: res.data.data.activities[0].id
        }, (resNew) => {
          if (resNew.data.code == 200) {
            that.setData({
              list: resNew.data.data[0].goodsInfo
            })
            that.selectComponent("#listTwo")._onOption(that.data.list,true)
          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
        
        wx.hideLoading()
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 切换
  switchs:function(e){
    let that = this 
    that.setData({
      type: e.currentTarget.dataset.type
    })
    // if (that.data.type =='square'){
      that.selectComponent("#listTwo")._onOption(that.data.list,true)
    // }else{
    //   that.selectComponent("#listOne")._onOption(that.data.list)
    // }
  },
  onTwoItemClick:function(e){
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index

    that.setData({
      twoIndex: index,
      activityId: item.id
    })
    wx.showLoading()
    this.postShareImg(item.id)
    post('/mall/V2/newActivityList', {
      id: item.id
    }, (resNew) => {
      if (resNew.data.code == 200) {
        that.setData({
          list: resNew.data.data[0].goodsInfo
        })
        // if (that.data.type == 'square') {
          that.selectComponent("#listTwo")._onOption(that.data.list,true)
        // } else {
        //   that.selectComponent("#listOne")._onOption(that.data.list)
        // }
        wx.hideLoading()
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    

  },
 
  // 页面内分享
  onShare: function () {
    if (wx.getStorageSync('uid')) {
      this.setData({
        sharelayer: true
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + '' + '&codeNumber=' + ''
      })
    }
  },

  goPoster: function () {
    wx.navigateTo({
      url: "/page/other/pages/poster/poster?goodsId=" + this.data.activityId + '&url=' + '/share/mallNewIconShareForward' + '&id=mustBuy',
    })
  },
  // 关闭分享
  shareLayerClosed: function () {
    this.setData({
      sharelayer: false
    })
  },

  postShareImg: function (id) {
    let that = this
    post('/app/mall/mallShare', {
      uid: wx.getStorageSync('uid'),
      type:id
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          shareTitle: res.data.remind,
          shareImg: res.data.showImg,
        })
      } 
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1);
  },
  onShareAppMessage: function () {
    let that = this
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {

    }
    let url = "page/Yuemall/pages/mustBuy/mustBuy" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid') + '&activityId=' + that.data.activityId
    console.log(url)
    return {
      title: that.data.shareTitle,
      imageUrl: that.data.shareImg,
      path: url
    }
  },
})