// page/Yuemall/pages/JDList/JDList.js
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: true, //是否显示全部频道
    scrollId: '', //选中ID
    currentTab: '', //预设当前项的值
    showViewHeight: false,
    flashStateitem: [],
    isHaveMore: true,
    goodsType: [],
    pageSize: 10,
    page: 1
  },
  // 数据请求
  ordeData: function (aid, id, channelId) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    });
    if (that.data.categoryThreeId == undefined) {
      that.setData({
        categoryThreeId: ''
      })
    }
    get('/mall/list?channelId=' + channelId + '&categorySecondId=' + aid + '&page=' + that.data.page + '&categoryThreeId=' + id, {}, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          goodsType: res.data.data.skuGoodsType,
          list: res.data.data.goodinfo,
          page: that.data.page + 1
        })
        wx.hideLoading()
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  //页面滚动监听
  onPageScroll: function (e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  // 点击标题切换
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        Tab: cur,
        page: 1,
        isHaveMore: true
      })
    }
    this.ordeData(this.data.aid, cur, this.data.channelId)
    this.setData({
      howViewHeight: (!this.data.showViewHeight)
    })

  },
  //切换图片
  cutImage: function (event, id) {
    var that = this;
    that.setData({
      showView: (!that.data.showView),
      showViewHeight: (!that.data.showViewHeight)
    })
  },
  // 点击全部标题
  swichLabel: function (e) {
    var cur = e.currentTarget.dataset.label;
    var id = 'd' + cur

    if (this.data.Tab == cur) {
      return false;
    } else {
      this.setData({
        Tab: cur,
        currentTab: cur,
        page: 1
      })
    }
    this.setData({
      showView: (!this.data.showView),
      scrollId: 'd' + cur
    })
    this.ordeData(this.data.aid, cur, this.data.channelId)
    this.setData({
      showViewHeight: false,
      isHaveMore: true
    })
  },

  //禁止滑动  
  disMove: function () {

  },
  // 详情
  details: function (e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.ordeData(options.aid, options.id, options.channelId)
    that.setData({
      cardType: wx.getStorageSync('cardType'),
      currentTab: options.id,
      Tab: options.id,
      aid: options.aid,
      channelId: options.channelId
    })
    console.log(options.channelId)
    wx.setNavigationBarTitle({
      title: options.title
    })
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorageSync('curCar', '1')
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
    let that = this
    if (this.data.isHaveMore) {
      get('/mall/list?channelId=3' + '&categorySecondId=' + that.data.aid + '&page=' + that.data.page + '&categoryThreeId=' + that.data.Tab, {}, (res) => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.data.goodinfo),
            page: res.data.data.goodinfo.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.goodinfo.length > 0 ? true : false
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  }
})