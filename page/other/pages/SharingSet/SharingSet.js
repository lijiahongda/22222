// page/other/pages/SharingSet/SharingSet.js
import {
  relations,
  retrunScene,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    // this.initSelected(this.data.colorSize, '100000942707')
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        console.log(sceneObj)
        if (sceneObj.I == 1) { //今日特价
          wx.redirectTo({
            url: '/page/Yuemall/pages/Monastery/Monastery?typePage=' + 'jiuyuandian' + '&url=' + '/mall/nineShop' + '&name=' + '京东每日特价' + '&reCode=' + sceneObj.C + '&channelId=' + that.data.channelId
          })
        } else if (sceneObj.I == 2) { //积分商城
          wx.redirectTo({
            url: '/page/Yuemall/pages/IntegralMall/IntegralMall?reCode=' + sceneObj.C
          })
        } else if (sceneObj.I == 3) { //寺库全品
          // wx.redirectTo({
          //   url: '/page/Yuemall/pages/AllCategories/AllCategories?type=' + 'siku' + '&reCode=' 
          // })
          wx.navigateTo({
            url: '/page/Yuemall/pages/JDclassification/JDclassification?channelId=' + 1 + sceneObj.C
          })
        } else if (sceneObj.I == 4) { //网易全品
          wx.redirectTo({
            url: '/page/Yuemall/pages/JDclassification/JDclassification?channelId=' + 6 + sceneObj.C
          })
        } else if (sceneObj.I == 5) { //18悦旅诚品，16九元店，26有好货
          let name = '悦旅诚品'
          if (sceneObj.D == 16) {
            name = '9元店'
          } else if (sceneObj.D == 26) {
            name = '有好货'
          }
          wx.redirectTo({
            url: '/page/Yuemall/pages/HotStyle/HotStyle?id=' + sceneObj.D + '&reCode=' + sceneObj.C + '&name=' + name
          })
        } else if (sceneObj.I == 6) { //秒杀
          wx.redirectTo({
            url: '/page/Yuemall/pages/RushBuyList/RushBuyList?reCode=' + sceneObj.C
          })
        } else if (sceneObj.I == 7) { //新品爆款
          console.log('======')
          wx.redirectTo({
            url: '/page/Yuemall/pages/NewHotStyle/NewHotStyle?id=' + sceneObj.D + '&reCode=' + sceneObj.C
          })
        } else if (sceneObj.I == 8) { //限时半价
          wx.redirectTo({
            url: '/page/Yuemall/pages/HalfPrice/HalfPrice?reCode=' + sceneObj.C
          })
        } else if (sceneObj.I == 9) { //拼团
          wx.redirectTo({
            url: '/page/Yuemall/pages/AssembleList/AssembleList?reCode=' + sceneObj.C

          })
        } else if (sceneObj.I == 10) { //全球购
          wx.redirectTo({
            url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + 118 + '&name=' + '全球购' + '&url=' + '/mall/allEarthList' + '&typePage=' + 'quanqiugou' + '&reCode=' + sceneObj.C

          })
        } else if (sceneObj.I == 11) { //砍价
          wx.redirectTo({
            url: '/page/Yuemall/pages/BargainPriceList/BargainPriceList?reCode=' + sceneObj.C
          })
        } else if (sceneObj.I == 12) { //京东全品
          wx.redirectTo({
            url: '/page/Yuemall/pages/JDclassification/JDclassification?reCode=' + sceneObj.C + '&channelId=' + 3
          })
        } else if (sceneObj.I == 14) { //会员权益
          wx.setStorageSync('isShareSet', 'isShareSet')
          relations(sceneObj.C);
          wx.switchTab({
            url: '/page/EliteCard/EliteCard'
          })
        } else if (sceneObj.I == 15) { //视频带货
          relations(sceneObj.C);
          wx.redirectTo({
            url: '/page/videoDetail/pages/detail/detail?reCode=' + sceneObj.C + '&video_id=' + sceneObj.B
          })
        } else if (sceneObj.I == 30) {
          let channelId = 3
          wx.setStorageSync('isShareSet', 'isShareSet')
          relations(sceneObj.C);
          console.log(sceneObj.D)
          if (sceneObj.D == 0) {
            channelId = 3
          } else {
            channelId = 6
          }
          wx.navigateTo({
            url: '/page/Yuemall/pages/JDSpecialOffer/JDSpecialOffer?reCode=' + +sceneObj.C + '&name=' + '京东每日特价' + '&channelId=' + channelId + '&id=' + sceneObj.D
          })
        } else if (sceneObj.I == 31) { //团长免费拿
          wx.navigateTo({
            url: '/page/assembleFree/page/AssembleDetail/AssembleDetail?reCode=' + +sceneObj.C + '&teamid=' + sceneObj.D
          })
        } else if (sceneObj.I == 32) { //饿了么
          wx.navigateTo({
            url: '/page/Yuemall/pages/ELM/ELM?reCode=' + sceneObj.C
          })
        } else if (sceneObj.I == 33) { //分享送券
          console.log('===')
          wx.navigateTo({
            url: '/page/Yuemall/pages/InvitationGifts/InvitationGifts?codeNumber=' + sceneObj.C + '&activityId=' + sceneObj.D
          })
        } else if (sceneObj.I == 34) { //社群购商品详情
          console.log('===')
          that.getDetailInfo(sceneObj.I, sceneObj.A,sceneObj.C,sceneObj.R)

        } else if (sceneObj.I == 35) { //社群购商品列表
          console.log('===')
          wx.navigateTo({
            url: '/page/community/pages/main/commodities/index?room_id=' + sceneObj.R + '&reCode=' + sceneObj.C
          })
        }
      });
    }
  },

  getDetailInfo: function (I, A,C,R) {
    post('/mall/community/getOrtherParams', {
      "type": I,
      "activityId": A
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        console.log('333333')
        wx.redirectTo({
          url: '/page/community/pages/main/communityDetail/communityDetail?reCode=' + C + '&room_id=' + R + '&goodsId=' + res.data.data.goodsId+ '&activityId=' + A
        })
        // wx.redirectTo({
        //   url: '/page/community/pages/main/communityDetail/communityDetai?reCode=' + C + '&room_id=' + R + '&goodsId=' + res.data.data.goodsId+ '&activityId=' + A
        // })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  }
})