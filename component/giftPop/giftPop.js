// components/popup/popup.js
import {
  post
} from '../../utils/util.js';
var app = getApp();
Component({
  /**
   * Component properties
   */
  properties: {
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: ''     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗图片
    image: {
      type: String,
      value: ''
    },

    // 弹窗取消按钮文字
    btn_no: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    btn_ok: {
      type: String,
      value: '确定'
    }
  },

  /**
   * Component initial data
   */
  data: {
    flag: false,
  },

  /**
   * Component methods
   */
  methods: {
    onOption: function (option) {
      let that = this
      console.log(option, 'option')
      if (option != '' && option.couponInfo.length>0) {
        console.log('================================')
        that.setData({
          flag:true,
          list: option,
        })
      }
    },
    goUse:function(e){
      console.log(e)
      let id = e.currentTarget.dataset.id
      let modules = e.currentTarget.dataset.modules
      let skuid = e.currentTarget.dataset.skuid
      if (id == 1 || id == 4 ){
        //商城首页 ,1,,3,4,5
        wx.switchTab({
          url: "/page/Mall/YueMall"
        })
      }
      if (id == 3){
      //shagoinxiangqing
        wx.navigateTo({
          url: '/page/Yuemall/pages/details/details?goodsId=' + modules + '&skuid=' + skuid,
        })
      }
      
      if (id == 5) {
        //活动详情
        wx.navigateTo({
          url: 'page/Yuemall/pages/NewHotStyle/NewHotStyle?id=' + modules 
        })
      }
      
    },
    //隐藏弹框
    hidePopup: function () {
      this.setData({
        flag: false,
      })
    },
    //展示弹框
    showPopup() {
      this.setData({
        flag: !this.data.flag
      })
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _error() {
      //触发取消回调
      this.triggerEvent("error")
    },
    _success() {
      //触发成功回调
      this.triggerEvent("success");
    }
  }
})