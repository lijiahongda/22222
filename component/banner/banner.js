// component/banner/banner.js
var app = getApp();
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
    ad:[],
    currentBannerIndex: 0,
    bgcolor:'#fff'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onOption:function(option,bgcolor,width,height,top){
      let that = this
      console.log(option,'opttt')
      that.setData({
        ad:option,
        bgcolor: bgcolor,
        heights:height,
        top:top
      })
    },
    // 分类列表
    classificationList: function (e) {
      app.classificationList(e, this)
    },
    bannerChange: function (e) {
      this.setData({
        currentBannerIndex: e.detail.current
      })
    },
  }
})
