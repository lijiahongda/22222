// component/lineTwoListFlow/lineTwoListFlow.js
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
    list:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onOption: function (option) {
      this.setData({
        list: option
      })
    },
    details: function (e) {
      console.log('/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid + '&productType=' + e.currentTarget.dataset.producttype,'==========')
      wx.navigateTo({
        url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid + '&productType=' + e.currentTarget.dataset.producttype
      })
    },
    
    /**
     * 页面上拉触底事件的处理函数
     */
    _onReachBottom: function (option) {
      let that = this
      that.setData({
        list: that.data.list.concat(option),
      })
    },
  }
})
