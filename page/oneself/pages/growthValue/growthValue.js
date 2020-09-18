import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    data:{},
    listData:[],
    rulesData:{},
    rulesList:[],
    page:1,
    showNomore:false,
    showRules: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token')
    })
    this.getData()
    this.getRulesData()
  },

  // 获取账户信息
  getData(){
    let that= this,
      data={
      page: this.data.page,
      pageSize: 10
    }
    post('/app/growth/getMemberGrowth', data, (res) => {
      wx.stopPullDownRefresh()
      if (res.data.code == 200) {
        that.setData({
          data: res.data.data,
          listData: that.data.listData.concat(res.data.data.result)
        })
        if (res.data.data.result.length<10){
          that.setData({
            showNomore: true
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, that.data.token, true, that.data.uid,1)
  },

  // 获取规则信息
  getRulesData() {
    let that = this
    post('/app/getGrowthRule', {}, (res) => {
      wx.stopPullDownRefresh()
      if (res.data.code == 200) {
        let rulesList = res.data.data.content.split('\n')
        that.setData({
          rulesList,
          rulesData: res.data.data
        })
      } else {
      }
    }, 1, that.data.token, true, that.data.uid, 1)
  },

  // 更改type
  changeType(e){
    console.log(e)
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },

  // 显示规则开关
  changeRules(){
    wx.navigateTo({
      url: '/page/oneself/pages/growthRule/growthRule?growthRules'
    })
    // this.setData({
    //   showRules: !this.data.showRules
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      listData:[]
    })
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.showNomore){
      return 
    }
    this.setData({
      page: this.data.page+1
    })
    this.getData()
  },
})