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
    page: 1,
    isHaveMore: true,
    authorizationStatus: false,
    pageSize:10
  },

  /**
   * 组件的方法列表
   */
  methods: {
    orderData: function() {
      let that = this
      post('/mall/getAppointmentList', {
        uid: wx.getStorageSync('uid')
      }, (res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log(res)
          that.setData({
            Returnitem: res.data.data
          })
          that.selectComponent("#banner")._onOption(res.data.banner, '#C9261A') //传banner
        } else {}
        wx.hideLoading()
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      
      post('/mall/getGuideList', {
        page:that.data.page,
        pageSize: that.data.pageSize
      }, (res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log(res)
          that.setData({
            ShoppingGuide:res.data.data.list,
            page:that.data.page+1
          })
        } else { }
        wx.hideLoading()
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    },
    OpeningRegiment: function(e) {
      let that = this
      if (wx.getStorageSync('uid')) {
        let {
          actid,
          goodsid
        } = e.currentTarget.dataset
        post('/mall/liveReserveGoods', {
          mid: wx.getStorageSync('uid'),
          act_id: actid,
          act_goods_id: goodsid
        }, (res) => {
          wx.hideLoading();
          if (res.data.code == 200) {
            console.log(res)
            wx.showToast({
              icon: 'none',
              title: '恭喜，预约成功'
            })
            that.orderData()
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.msg
            })
          }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
      }else{
        that.VerificationCode()
      }
    },
    // 手机号验证码
    VerificationCode: function () {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
      })
    },
    // 商品详情
    goodDetail:function(e){
      let {goodid, skuid}=e.currentTarget.dataset
      wx.navigateTo({
        url: '/page/Yuemall/pages/details/details?goodsId='+goodid+'&skuid='+skuid,
      })
    },
    // 视频
    Videodetail: function(e) {
      console.log(e.currentTarget.dataset.videoid)
      wx.navigateTo({
        url: '/page/videoDetail/pages/detail/detail?video_id=' + e.currentTarget.dataset.videoid + '&dynamicid=' + e.currentTarget.dataset.dynamicid
      })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    _onReachBottom: function() {
      let that = this
      if (this.data.isHaveMore) {
        post('/mall/getGuideList', {
          page: that.data.page,
          pageSize: that.data.pageSize
        }, (res) => {
          if (res.data.code == 200) {
            console.log(res)
            that.setData({
              ShoppingGuide: that.data.ShoppingGuide.concat(res.data.data.list),
              page: res.data.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.list.length > 0 ? true : false
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
          wx.hideLoading()
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    }
  }
})