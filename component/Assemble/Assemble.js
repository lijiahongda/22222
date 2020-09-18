// component/Assemble/Assemble.js
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
    authorizationStatus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 分类列表
    classificationList: function (e) {
      app.classificationList(e, this)
    },
    orderData: function () {
      let that = this
      get('/hd/assembleList' + '?page=' + that.data.page + '&channel=' + 7 +'&pageSize=10', {}, (res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            ad: res.data.data.ad,
            item: res.data.data.item,
            page: that.data.page + 1,
            share: res.data.data.share
          })
          that.triggerEvent('myevent', res.data.data.share);   //子组件传给父组件参
          if (that.data.title == '拼团') {
            that.setData({
              ad: res.data.data.adApp
            })
          }
          that.selectComponent("#banner")._onOption(that.data.ad, '#C9261A') //传banner
        } else { }
        wx.hideLoading()
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    },
    detail: function (e) {
      let url = e.currentTarget.dataset.url
      wx.navigateTo({
        url: url + '?' + 'teamid' + '=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid,
      })
    },
    /**
   * 页面上拉触底事件的处理函数
   */
    _onReachBottom: function () {
      let that = this
      if (this.data.isHaveMore) {
        get('/hd/assembleList' + '?page=' + that.data.page + '&channel=' + 7 + '&pageSize=10', {}, (res) => {
          if (res.data.code == 200) {
            let item = that.data.item;
             item = res.data.data.item;
            console.log(res)
            that.setData({
              item: that.data.item.concat(res.data.data.item),
              page: res.data.data.item.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.item.length > 0 ? true : false
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
