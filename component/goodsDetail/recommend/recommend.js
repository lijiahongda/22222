// component/goodsDetail/recommend/recommend.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommendGoods:Array // 推荐列表
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    detail(e){
      this.triggerEvent('detail', { data: e.currentTarget.dataset }, {})
    }
  }
})
