// page/community/pages/main/components/mainCommodity/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodId: {
      type: '',
      value: ''
    },
    activityId: {
      type: '',
      value: ''
    },
    goodCover: {
      type: '',
      value: ''
    },
    goodVipPrice:{
      type:'',
      value: ''
    },
    sharePrice:{
      type:'number',
      value: ''
    },
    imgwidth: {
      type: '',
      value: ''
    },
    text: {
      type: Boolean,
      value: ''
    },
    roomId: {
      type: '',
      value: ''
    },

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
    // 打开商品列表
    commodities(e) {
      let that = this
      console.log(this.data.goodId, this.data.activityId, that.data.roomId,'=======999999999')
      wx.navigateTo({
        url: '/page/community/pages/main/communityDetail/communityDetail?goodsId=' + that.data.goodId + '&activityId=' + that.data.activityId + '&room_id=' + that.data.roomId,
      })
    },
  }
})
