// page/Yuemall//pages/NewLevelPages/NewLevelPages.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: [1, 2, 3, 4, 5, 6,7,8,9,10],
    typeList: [],
    page: 1,
    pageSize: 10,
    isHaveMore: true
  },
  // 分类列表
  classificationList: function (e) {
    app.classificationList(e, this)
  },
  LevelList: function(e) {
    console.log(e,'eeeeeeeeeeeee')
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/page/Yuemall/pages/LevelList/LevelList?keyWord=' + e.currentTarget.dataset.name + '&type=' + type + '&categoryThreeId=' + e.currentTarget.dataset.id
    })
  },
  initData: function() {
    let that = this
    post('/mall/V2/recommendList', {
      categoryId: that.data.id,
      uid: wx.getStorageSync('uid'),
      page: that.data.page,
      pageSize: that.data.pageSize
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data,
          page: that.data.page + 1
        })
      //   let i = 0;
      //   let status = true
      //   let scrollviewWidth = 710
      //   let brandWidth = (130 * that.data.image.length) + (31 * that.data.image.length)
      //   let DifferenceValue = (brandWidth - scrollviewWidth)/7
      //   console.log(DifferenceValue)
      //   let intervalId = setInterval(function () {
      //     if (i <= DifferenceValue && status) {
      //       i++
      //       that.setData({
      //         scrollleft: i
      //       })
      //       console.log('+++++')
      //       console.log(i)
      //       console.log(DifferenceValue)
      //     } else {
      //       console.log('-----')
      //       i--
      //       status= false
      //       that.setData({
      //         scrollleft: i
      //       })
      //       console.log(i)
      //       if(i<-50){
      //         status = true
      //       }
      //       console.log(DifferenceValue)
      //     }
      //   }, 1);
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    post('/mall/V2/newCategoryList', {
      categoryId: that.data.id,
      uid: wx.getStorageSync('uid'),
      channelId: that.data.channelId
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          banner: res.data.data.banner,
          activity: res.data.data.activity,
          category: res.data.data.category
        })
        if (res.data.mechanismId != '') {
          that.selectComponent("#couponPopup")._onOption(res.data.mechanismId)
        } else {
          
        }
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      channelId: options.channelId,
      id: options.id
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    console.log(options)
    that.initData()
    // console.log('-----+++++++')
  },
  bindscroll: function(e) {
    // console.log(e)
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
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  details: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    if (this.data.isHaveMore) {
      post('/mall/V2/recommendList', {
        categoryId: that.data.id,
        uid: wx.getStorageSync('uid'),
        page: that.data.page,
        pageSize: that.data.pageSize
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data),
            page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.length > 0 ? true : false
          })
        } else {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none'
          // })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  },
})