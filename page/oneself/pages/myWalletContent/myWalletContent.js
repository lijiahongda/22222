// page/oneself/pages/myWalletContent/myWalletContent.js
import WxParse from "../../../../wxParse/wxParse/wxParse.js"
import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //预设当前项的值,
    state: 2,
    page: 1,
    pageSize: 10,
    isHaveMore: true,
    // order:[1,2,3]
  },
  // 采购结算
  ProcurementSettlement:function(){
    wx.navigateTo({
      url: '/page/yueMember/pages/personalStoresList/personalStoresList?time=' + 'total' +'&name='+'采购结算',
    })
  },
  // 销售结算
  SalesSettlement:function(){
    wx.navigateTo({
      url: '/page/oneself/pages/SalesSettlement/SalesSettlement',
    })
  },
  // 结算记录
  SettlementRecord:function(e){
    wx.navigateTo({
      url: '/page/oneself/pages/SettlementRecord/SettlementRecord',
    })
  },
  CommissionsDescription: function(e) {
    wx.navigateTo({
      url: '/page/oneself/pages/CommissionsDescription/CommissionsDescription',
    })
  },
  Division: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;

    this.util(currentStatu)
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
  // 标签切换
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        isHaveMore: true
      })
    }
    if (this.data.currentTab == 0) {
      this.setData({
        state: 2,
        page: 1
      })
      this.getOrderList()
    } else if (this.data.currentTab == 1) {
      this.setData({
        state: 3,
        page: 1
      })
      this.getOrderList()

    } else if (this.data.currentTab == 2) {
      this.setData({
        state: 1,
        page: 1
      })
      this.getOrderList()

    } else if (this.data.currentTab == 3) {
      this.setData({
        state: 4,
        page: 1
      })
      this.getOrderList()
      get('/app/member/bonusV3/getSaleBonusSum', {}, (res) => {
        if (res.data.code == 200) {
          this.setData({
            daySum7: res.data.data.daySum7,
            daySum30: res.data.data.daySum30,
            monthSum12: res.data.data.monthSum12
          })
        } else {}
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    }
  },
  //获取页面内容
  getOrderList: function() {
    var that = this
    post('/app/member/getSales' , {}, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          data:res.data.data
        })
        WxParse.wxParse('article', 'html', res.data.data.explain, that, 5);
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // that.getOrderList()
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
    if (wx.getStorageSync('uid')) {
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
    }
    this.getOrderList()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    let nickname = wx.getStorageSync('nickname');
    wx.getStorage({
      key: 'uid',
      success: function(res) {
        that.setData({
          uid: res.data
        });
        wx.getStorage({
          key: 'token',
          success: function(res) {
            that.setData({
              token: res.data
            });
          }
        });
      }
    });
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route;

    var options = currentPage.options;
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {
      // Do something when catch error
    }
    return {
      title: nickname + '送您50元现金，赶快点击领取吧！',
      imageUrl: that.data.sharePic,
      path: "/page/Mall/YueMall" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid')
    }
  },
  toPage(){
    wx.navigateTo({
      url: '/page/MyRote/MyRote'
    })
  },
  // 打开账户余额页面
  openPayment(){
    wx.navigateTo({
      url: '/page/community/pages/payment/payMain/index',
    })
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
    let that = this
    if (that.data.isHaveMore) {
      get('/app/member/bonusV3/newList/' + that.data.state + '/' + that.data.page + '/' + that.data.pageSize, {}, (res) => {
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

  }
})