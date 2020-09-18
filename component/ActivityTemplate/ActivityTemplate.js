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
    activity:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onOption:function(options){
      console.log(options,'options')
      this.setData({
        activity: options
      })
    },
    // 分类列表
    classificationList: function (e) {
      app.classificationList(e, this)
    },
  }
})
