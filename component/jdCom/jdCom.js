// component/jdCom/jdCom.js
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
    currentTabLeve: 0,
    currentTab: 0, //预设当前项的值
    isHaveMore: true,
    skuGoodsType: [],
    page: 1,
    authorizationStatus: false,
    typeId: 1,
    channelId: 3,
    cardImg:'',
    cardType:''
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
        issetType: true,
        channelId: options.channelId,
        name: options.name,
        typeId: options.id,
        scrollId: 'd' + options.id,
        cardType: wx.getStorageSync('cardType')
      })
      console.log('ssss', that.data.cardType)
      that.initData()
    },
    swichNavLeve: function (e) {
      let that = this
      let cur = e.target.dataset.current;
      if (that.data.currentTabLeve == cur) {
        return false;
      } else {
        that.setData({
          currentTabLeve: cur,
          page: 1,
          typeId: cur,
          isHaveMore: true
        })
      }
      that.getOrder()
    },
    // 大礼包
    EliteCard:function(){
      wx.switchTab({
        url: '/page/EliteCard/EliteCard',
      })
    },
    // 点击标题切换
    swichNav: function (e) {
      let that = this
      let cur = e.target.dataset.current;
      let item = e.currentTarget.dataset.item
      if (that.data.currentTaB == cur) {
        return false;
      } else {
        that.setData({
          currentTab: cur,
          page: 1,
          typeId: item.typeList[0].typeId,
          isHaveMore: true,
          typeList: item.typeList,
          currentTabLeve: item.typeList[0].typeId
        })
      }
      that.getOrder()
    },
    
    getOrder: function () {
      let that = this
      wx.showLoading()
      get('/mall/newPreferential?page=' + that.data.page + '&typeId=' + that.data.typeId + '&channelId=' + that.data.channelId +'&pageSize=10', {}, (res) => {
        if (res.data.code == 200) {
          let type = res.data.data.types
          for (let t = 0; t < type.length; t++) {
            if (that.data.typeId == 0) { //如果typeId ==  0
              that.setData({
                currentTabLeve: type[0].typeList[0].typeId,
                typeList: type[0].typeList,
                currentTab: type[0].typeId,
              })
            } else if (that.data.typeId == type[t].typeId) {
              that.setData({
                currentTabLeve: type[t].typeList[0].typeId,
                typeList: type[t].typeList,
                currentTab: type[t].typeId,
              })
            }
          }
          that.setData({
            page: that.data.page + 1,
            bgImg: res.data.data.bgImg,
            types: res.data.data.types,
            issetType: false,
            cardImg: res.data.data.cardImg
          })
          that.selectComponent("#lineTwoListFlow")._onOption(res.data.data.list)
          that.selectComponent("#banner")._onOption(res.data.data.banner, '#fff') //传banner
          wx.hideLoading()
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    },
    initData: function () {
      let that = this
      that.getOrder()
      post('/mall/indexShare', {
        uid: wx.getStorageSync('uid')
      }, (res) => {
        if (res.data.code == 200) {
          if (that.data.channelId == 3) {
            that.setData({
              top100: res.data.data.shareData.jdSpcial
            })
          } else {
            that.setData({
              top100: res.data.data.shareData.kaola
            })
          }

        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    },
    _onReachBottom: function () {
      let that = this
      wx.showLoading()
      if (that.data.isHaveMore) {
        get('/mall/preferential?page=' + that.data.page + '&typeId=' + that.data.typeId + '&channelId=' + that.data.channelId, {}, (res) => {
          if (res.data.code == 200) {
            that.setData({
              // list: that.data.list.concat(res.data.data.list),
              page: res.data.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.list.length > 0 ? true : false
            })
            this.selectComponent("#lineTwoListFlow")._onReachBottom(res.data.data.list)
          } else {

          }
          wx.hideLoading()
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    },
  }
})
