// component/LimitedTime/LimitedTime.js
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
    list:Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    isHaveMore: true,
    page: 1,
    pageSize: 10,
    exclusive:[] 
  },
  created:function(){
    let that = this
    that.dataList()
    that.choose()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dataList: function () {
      let that = this
      wx.showLoading()
      post('/mall/halfPriceList', {
        page: that.data.page,
        pageSize: that.data.pageSize,
        fromType: 7
      }, (res) => {
        if (res.data.code == 200) {
          let data = res.data.data
          that.setData({
            list: data,
            page: that.data.page + 1,
            ad: res.data.ad,
            share: res.data.share
          })
          that.selectComponent("#banner")._onOption(res.data.ad,'#C9261A') //传banner
          that.triggerEvent('myevent', res.data.share);   //子组件传给父组件参
          setTimeout(function () {
            wx.hideLoading()
          }, 1500)
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    },
    // 换一换
    choose:function(){
      let that = this
      wx.showLoading()
      post('/mall/getRecommend', {
        fromType: 7
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            exclusive: res.data.data,
          })
          wx.hideLoading()
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    },

    Details: function (e) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/RushBuyDetail/RushBuyDetail?goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid + '&activityId=' + e.currentTarget.dataset.activityid + '&type=' + 'half'
      })
    },
    
    _onReachBottom: function () {
      let that = this
      wx.showLoading()
      if (this.data.isHaveMore) {
        post('/mall/halfPriceList', {
          page: that.data.page,
          pageSize: that.data.pageSize,
          fromType: 7
        }, (res) => {
          if (res.data.code == 200) {
            that.setData({
              list: that.data.list.concat(res.data.data),
              page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.length > 0 ? true : false
            })
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
