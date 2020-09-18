// component/goodsDetail/comment/comment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    typeC:{
      type:Boolean,
      value:false
    },
    comment:{
      type:Object,
      value:{
        comment_total:0,
        result:[]
      }
    },
    goodsId:String
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
    share: function (e) {
      console.log(e)
      var item = e.currentTarget.dataset.item
      this.triggerEvent('share', { community: true,reviewId:item.id });
    },
    lookComment(){
      console.log(this.properties.goodsId)
      wx.navigateTo({
        url: '/page/Yuemall/pages/lookComment/lookComment?productid=' + this.properties.goodsId,
      })
    },
    checkImg(e){
      var imglist = e.currentTarget.dataset.imglist
      var ind = e.currentTarget.dataset.ind
      wx.previewImage({
        current: imglist[ind], // 当前显示图片的http链接
        urls: imglist // 需要预览的图片http链接列表
      })
      console.log(e)
    }
  }
})
