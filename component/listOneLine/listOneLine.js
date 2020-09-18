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
    list:[]
  },
  created:function(){
    let that = this
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onOption: function (option, isMustBuy) {
      let that = this
      that.setData({
        list: option,
        isMustBuy: isMustBuy
      })
      console.log(isMustBuy)
    },
    // 分类列表 跳转到商品详情
    classificationList: function (e) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/details/details?parentTypeId=' + '&goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid,
      })
      // wx.navigateTo({
      //   url: '/page/Yuemall/pages/MembershipProductDetails/MembershipProductDetails?goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid
      // })
    },
    
  }
})
