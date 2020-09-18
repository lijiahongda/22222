// page/community/pages/main/group/activation/index.js
import {
  get,
  post,
  relations,
  retrunScene,
} from '../../../../../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex:'0',
    isPlus:0,//是否是会员，1-plus，0-普通
    page: 1,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    if (wx.getStorageSync('uid')) {
      that.setData({
        room_id: options.room_id
      })
      // this.getData()
    } else {
      this.VerificationCode()
    }

  },
  getmemberData: function () {
    wx.showLoading({
      title: '加载中',
    })
    var page = this.data.page
    let that = this
    post('/community/group/queryMemberList', {
      groupId: that.data.room_id,
      page: page,
      pageSize: 10,
    }, (res) => {
      console.log(res, '--------')
      if (res.data.code == 200) {
        wx.hideLoading()
        page++
        that.setData({
          list: this.data.list.concat(res.data.data),
          page
        })
        console.log(this.data.list)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  },
  // tab点击事件
  grouptabC(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      tabIndex: index
    })
    if (this.data.tabIndex == '2'){
      this.selectComponent("#people").getmemberData()
    } else if (this.data.tabIndex == '1') {
      // var start = this.selectComponent("#order").getNow()
      // var end=this.selectComponent("#order").getNow()
      // console.log(start,end)
      // this.selectComponent("#order").getData()
    }
  },
  Child(e){
    let that = this
    console.log(e,'2222222222')
    that.setData({
      info: e.detail.info,
      clickCount: e.detail.clickCount
    })
  },
  Child2(e) {
    let that = this
    console.log(e, '2222222222')
    that.setData({
      
    })
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if(this.data.tabIndex=='0'){
      // this.selectComponent("#share").getData()
    } else if (this.data.tabIndex == '1'){
      this.selectComponent("#order").getData()
    } else if (this.data.tabIndex == '2') {
      this.selectComponent("#people").getmemberData()
      console.log('555555555555555')
    }
  },
})