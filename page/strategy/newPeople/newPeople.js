import {
  get,
  post,
  relations
} from '../../../utils/util.js';
import WxParse from "../../../wxParse/wxParse/wxParse.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: { // 属性名
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    articleList:[]
  },
  pageLifetimes: {
    show: function () {
      console.log('----+++')
      this.getData()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openMember() {
      wx.switchTab({
        url: '/page/EliteCard/EliteCard',
      })
    },
    goGroupUp(e){
      wx.navigateTo({
        url: '/page/community/pages/groupUp/groupUp?status=' + e.currentTarget.dataset.status,
      })
    },
    getData(){
      let that=this
      this.setData({
        uid:wx.getStorageSync('uid'),
        token:wx.getStorageSync('token')
      })
      let data={
        source: 1
      }
      // 刷新个人信息
      wx.showLoading({
        title: '加载中',
      })
      post('/community/groupRule/raidersNewList', data, (res) => {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log('调取新人上手api')

          // 富文本解析
          let list = res.data.data
          list.forEach((obj,index)=>{
            WxParse.wxParse('article' + index, 'html', obj.content, that, 5);
            obj.richText = that.data['article' + index]
          })
          console.log(list)
          that.setData({
            list:list
          })
        }
      }, 1, this.data.token, true, this.data.uid, 1)
    },
    copy: function (e) {
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
    gray(){
      wx.showToast({
        title: '建群后才可申请开通助理',
        icon: 'none'
      })
    },
    goVideo(e){
      wx.navigateTo({
        url: '/page/community/pages/webVideo/webVideo?url=' + e.currentTarget.dataset.url,
      })
    },
    goIndex(){
      wx.navigateTo({
        url: '/page/community/pages/myGroup/myGroup',
      })
    }

  }
})
