import {
  get,
  post,
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rule: [
      '1. 消费获取消费抽奖码，分为天天乐码和周周乐码',
      '2. 次日12点前不参与抽奖则竞猜码失效',
      '3. 每100人设置一个奖品，最终奖品个数以当期参与人数为准',
      '4. 在优兔钱包中参与天天乐竞猜需持有20UTO，满100参与者则开启当期抽奖活动',
      '5. 在优兔钱包中参与周周乐竞猜需持有100UTO，满100参与者则开启当期抽奖活动',
      '6. 用户参与竞猜后，未连续竞猜视为自动放弃获奖机会',
      '7. 竞猜硬币正反面，获胜方将获得一下轮竞猜资格，当获胜方人数小于等于奖品份数时竞猜结束，获胜方赢得奖品'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  getList: function () {
    var that = this
    get('/app/member/prize/rules', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          bgImage: res.data.data.bgImage,
        })
        wx.hideLoading()
      } else {
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})