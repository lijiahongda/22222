// page/community/pages/main/group/activation/components/gpeople/index.js
import {
  get,
  post,
} from '../../../../../../../../utils/util.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 用户名字
    nickName: {
      type: String,
      value: ''
    },
    // 用户头像
    litpic: {
      type: String,
      value: ''
    },
    // 等级图标
    memberImg: {
      type: String,
      value: ''
    },
    room_id: {
      type: String,
      value: ''
    },
    list:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    peopleToggle:true,
    sort:'',
    isPlus:0,
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // loadData() {
    //   this.getmemberData()
    // },
    // up(){
    //   let that = this
    //   that.setData({
    //     sort:1,
    //     isPlus: that.data.isPlus
    //   })
    //   this.getmemberData() 
    // },
    // down(){
    //   let that= this
    //   that.setData({
    //     sort: 0,
    //     isPlus: that.data.isPlus
    //   })
    //   this.getmemberData() 
    // },
    getmemberData: function () {
      this.triggerEvent('getmemberData')
    },
    onReachBottom:function(){
      console.log('-----------')
    },
    // 复制昵称
    copyText: function (e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
        success(res) {
          wx.getClipboardData({
            success(res) { }
          })
        },
        complete(res) { }
      })
    },
  }
})
