// component/goodsDetail/title/tiitle.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: { // 属性名
      type: String,
      value: ''
    },
    image:{
      type: String,
      value: ''
    },
    tip: {
      type: String,
      value: ''
    },
    openMember:{
      type: Number,
      value:0
    },
    needer: {
      type: Number,
      value:0
    },
    rule: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModalStatus:false,
    yifen:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onOption: function (option,options) {
      let that = this
      console.log(option, 'option')
      console.log(options, 'optionssssss')

      if (option && option!=''){
        that.setData({
          yifen: true,
          list: option,
          list2: options,
        })
      }else{
        that.setData({
          yifen: false,
        })
      }
    },
    openMember(){
      wx.switchTab({
        url: '/page/EliteCard/EliteCard',
      })
    },
    openModal(){
      this.setData({
        showModalStatus: true
      })
    },
    hideModal(){
      this.setData({
        showModalStatus: false
      })
    }
  }
})
