// component/goodsDetail/select/select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    address:{
      type:Object,
      value:{}
    }, // 地址
    goodFreight:String, // 运费
    sizeSelectText:Array, // 规格列表
    goodsCoupon:Array, // 优惠券列表
    grouth:String, //成长值
    intextmin:String,//判断是否显示成长值
  },

  /**
   * 组件的初始数据
   */
  data: {
    mask:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    GrowthTab(e){
      console.log(e)
      wx.navigateTo({
        url: '/page/Yuemall/pages/GrowthDetails/GrowthDetails',
      })
     },
    // 选择地址
    selectAddress(){
      // detail对象，提供给事件监听函数
      var myEventDetail = {}
      // 触发事件的选项
      var myEventOption = {}
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      this.triggerEvent('address', myEventDetail, myEventOption)
    },

    // 关闭优惠券
    closeMask(){
      this.setData({
        mask:false
      })
    },

    // 显示优惠券
    showMask(){
      this.setData({
        mask: true
      })
    },
    
    // 领取优惠券
    getCoupon(e){
      console.log(e)
      this.triggerEvent('getCoupon',{id:e.currentTarget.dataset.id}, {})
    },

    // 弹出规格
    ToUp(){
      this.triggerEvent('ToUp', {}, {})
    },
  
  }
})
