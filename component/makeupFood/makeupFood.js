// component/makeupFood/makeupFood.js
import {
  get,
  post,
  relations
} from '../../utils/util.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    image: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    typeList: [],
    page: 1,
    pageSize: 10,
    cardImg:'',
    cardType: '',
    iscouponPopup:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 接收父传来的参数  父页面的onload
    _onOption: function (options) {
      let that = this
      console.log(options, '子组件option')
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        channelId: options.channelId,
        id: options.id,
        cardType: wx.getStorageSync('cardType')
      })
      console.log(options)
      that.initData()
    },
    // 分类列表
    classificationList: function (e) {
      app.classificationList(e, this)
    },
    // 大礼包
    EliteCard: function () {
      wx.switchTab({
        url: '/page/EliteCard/EliteCard',
      })
    },
    LevelList: function (e) {
      console.log(e, 'eeeeeeeeeeeee')
      let type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: '/page/Yuemall/pages/LevelList/LevelList?keyWord=' + e.currentTarget.dataset.name + '&type=' + type + '&categoryThreeId=' + e.currentTarget.dataset.id
      })
    },
    initData: function () {
      let that = this
      wx.showLoading()
      // 数据
      post('/mall/V2/newsCategoryList', {
        categoryId: that.data.id,
        channelId: that.data.channelId,
        uid: wx.getStorageSync('uid'),
      }, (res) => {
        console.log(res,'zheeeee')
        if (res.data.code == 200) {
          that.setData({
            category: res.data.data.category,
            cardImg: res.data.data.cardImg,
          })
          if (res.data.mechanismId != '') {
            console.log(11111111)
            that.selectComponent("#couponPopup")._onOption(res.data.mechanismId)
          } else {
            
          }
          this.selectComponent("#ActivityTemplate")._onOption(res.data.data.activity)
          this.selectComponent("#banner")._onOption(res.data.data.banner)
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)

      // 推荐
      post('/mall/V2/recommendList', {
        categoryId: that.data.id,
        page: that.data.page,
        pageSize: that.data.pageSize
      }, (res) => {
        if (res.data.code == 200) {
          this.selectComponent("#lineTwoListFlow")._onOption(res.data.data)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        wx.hideLoading()
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    },
    details: function (e) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
      })
    },
    /**
   * 页面上拉触底事件的处理函数
   */
    _onReachBottom: function () {
      let that = this
      that.data.page += 1
      wx.showLoading()
      post('/mall/V2/recommendList', {
        categoryId: that.data.id,
        page: that.data.page,
        pageSize: that.data.pageSize
      }, (res) => {
        if (res.data.code == 200) {
          if (res.data.data.length) {
            this.selectComponent("#lineTwoListFlow")._onReachBottom(res.data.data)
          } else {
            wx.showToast({
              title: '没有更多了！',
              icon: 'none'
            })
          }
          wx.hideLoading()
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      
    },
  }
})
