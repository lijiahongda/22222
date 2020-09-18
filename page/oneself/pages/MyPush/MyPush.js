import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    total: '',
    today: '',
    uid: '',
    token: '',
    page: 1,
    showModalStatus: false,
    isHaveMore: true
  },

  getOrderList: function () {
    var that = this;
    get('/app/member/invite/childList/'+ that.data.mid +'/'+ that.data.page, {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          member: res.data.data.member,
          team: res.data.data.team,
          order: res.data.data.list,
          page: that.data.page + 1
        })
      } else { }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    get('/app/member/invite/rule/', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          content: res.data.data.content
        })
      } else { }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))

  },
  hideModal: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        showModal: false
      })
    }.bind(this), 200)
  },
  MyPush: function (e) {
    wx.navigateTo({
      url: '/page/oneself/pages/MyPush/MyPush',
    })
  },
  CommissionsDescription: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;

    this.util(currentStatu)

  },
  util: function (currentStatu) {
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

    setTimeout(function () {

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
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      mid:options.mid
    })
    this.getOrderList();

  },
  onPullDownRefresh: function () {

  },
  onShow: function () {
    // this.getOrderList();
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let that = this
    if (that.data.isHaveMore) {
      get('/app/member/invite/myList/' + that.data.page, {}, (res) => {
        if (res.data.code == 200) {
          let order = that.data.order;
          that.setData({
            order: that.data.order.concat(res.data.data.list),
            page: res.data.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
            isHaveMore: res.data.data.list.length > 0 ? true : false
          })
        } else {

        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  },

})