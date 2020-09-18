// page/yueMember//pages/personalStores/personalStores.js
import {
  get,
  post
} from '../../../../utils/util.js';

Page({

  /**
   */
  data: {

  },
  StandbyCommission:function(){
    wx.navigateTo({
      url: '/page/yueMember/pages/StandbyCommission/StandbyCommission'
    })
  },
  connections:function(){
    wx.navigateTo({
      // url:'/page/yueMember/pages/connections/connections'
      // url: '/page/yueMember/pages/VideoRechargeDetail/VideoRechargeDetail?projectid=' + e.currentTarget.dataset.projectid
    })
  },
  hideModal: function() {
    this.setData({
      showModalStatus: false,
      showModal: false
    })
    // 隐藏遮罩层
    this.setData({
      showModalStatus: false,
      showModal: false,
    })

    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        showModal: false
      })
    }.bind(this), 200)
  },
  Division: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;

    this.util(currentStatu)
  },
  util: function(currentStatu) {
    var animation = wx.createAnimation({

      duration: 200,

      timingFunction: "linear",

      delay: 0

    });

    this.animation = animation;

    animation.opacity(0).rotateX(-100).step();

    this.setData({

      animationData: animation.export()

    })

    setTimeout(function() {

      animation.opacity(1).rotateX(0).step();

      this.setData({

        animationData: animation

      })

      if (currentStatu == "close") {

        this.setData(

          {

            showModalStatus: false

          }

        );

      }

    }.bind(this), 200)

    if (currentStatu == "open") {
      this.setData(

        {

          showModalStatus: true

        }

      );

    }

  },
  // 详情
  detail: function(e) {
    let type = e.currentTarget.dataset.left
    let name = ''
    let time = e.currentTarget.dataset.time
    if (type == 'left') {
      name = '采购结算'
    } else {
      name = '销售提成'
    }
    wx.navigateTo({
      url: '/page/yueMember/pages/personalStoresList/personalStoresList?name=' + name + '&type=' + type + '&time=' + time
    })
  },
  // 切换旋转箭头
  swivel: function(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let pos = e.currentTarget.dataset.pos
    if (type == 'today') {
      if (pos == 'left') {
        that.data.today.gPackage.state = 1
        that.data.today.sale.state = 0
      } else {
        that.data.today.gPackage.state = 0
        that.data.today.sale.state = 1
      }
    } else if (type == 'yestoday') {
      if (pos == 'left') {
        that.data.yestoday.gPackage.state = 1
        that.data.yestoday.sale.state = 0
      } else {
        that.data.yestoday.gPackage.state = 0
        that.data.yestoday.sale.state = 1
      }
    } else if (type == 'month') {
      if (pos == 'left') {
        that.data.month.gPackage.state = 1
        that.data.month.sale.state = 0
      } else {
        that.data.month.gPackage.state = 0
        that.data.month.sale.state = 1
      }
    } else if (type == 'total') {
      if (pos == 'left') {
        that.data.total.gPackage.state = 1
        that.data.total.sale.state = 0
      } else {
        that.data.total.gPackage.state = 0
        that.data.total.sale.state = 1
      }
    }
    that.setData({
      today: that.data.today,
      yestoday: that.data.yestoday,
      month: that.data.month,
      total: that.data.total
    })
  },
  initData: function() {
    let that = this
    post('/app/member/store/get', {}, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        res.data.data.today.gPackage.state = 1
        res.data.data.today.sale.state = 0
        res.data.data.yestoday.gPackage.state = 1
        res.data.data.yestoday.sale.state = 0
        res.data.data.month.gPackage.state = 1
        res.data.data.month.sale.state = 0
        res.data.data.total.gPackage.state = 1
        res.data.data.total.sale.state = 0
        that.setData({
          people: res.data.data.people,
          balance: res.data.data.balance,
          historyBalance: res.data.data.historyBalance,
          service: res.data.data.service,
          today: res.data.data.today,
          yestoday: res.data.data.yestoday,
          month: res.data.data.month,
          total: res.data.data.total
        })
        wx.hideLoading()
        console.log(res)
      } else {

      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.initData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setStorageSync('myrequest', '');

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})