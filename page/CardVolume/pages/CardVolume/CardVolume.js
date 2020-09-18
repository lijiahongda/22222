import {
  get,
  post
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    currentTab: 0, //预设当前项的值
    notUsed: '',
    use: '',
    uid: '',
    token: '',
    switchChecked:false // 优惠券提醒是否选中
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  // 展开介绍
  instruction(e){
    let data = this.data.notUsed
    data.forEach(item=>{
      if (item.cid == e.currentTarget.dataset.cid){
        item.showDesc = !item.showDesc
      }
    })
    this.setData({
      notUsed:data
    })
  },
  // 分享优惠券
  shareCoupon(e){
    if (e.currentTarget.dataset.redirect==3){
      wx.navigateTo({
        url: '/page/yueMember/pages/couponsGoods/couponsGoods?cid=' + e.currentTarget.dataset.cid + "&getCoupons=0",
      })
    }else if (e.currentTarget.dataset.redirect == 7) {
      wx.navigateTo({
        url: '/page/yueMember/pages/couponsActivity/couponsActivity?cid=' + e.currentTarget.dataset.cid + "&getCoupons=0&type=7",
      })
    } else if (e.currentTarget.dataset.modules == 5) {
      wx.navigateTo({
        url: '/page/yueMember/pages/couponsActivity/couponsActivity?cid=' + e.currentTarget.dataset.cid + "&getCoupons=0&type=5",
      })
    }else {
      wx.navigateTo({
        url: '/page/yueMember/pages/couponsActivity/couponsActivity?cid=' + e.currentTarget.dataset.cid + "&getCoupons=0&type=39",
      })
    }
  },
  // 使用优惠券
  immediateUse: function(e) {
    if (e.currentTarget.dataset.type == 1) { //酒店类型券
      wx.navigateTo({
        url: '/page/hotelHome/hotel/hotel'
      })
    } else if (e.currentTarget.dataset.type == 2) { //商城类型券
      if (e.currentTarget.dataset.modules == 2  && e.currentTarget.dataset.typeid == 3) {
        wx.navigateTo({
          url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodid + '&skuid=' + e.currentTarget.dataset.skuid,
        })
      } else { //商城首页
        wx.switchTab({
          url: "/page/Mall/YueMall"
        })
      }
    } else if (e.currentTarget.dataset.type == 3) { //线路类型券
      // wx.navigateTo({
      //   url: "/page/line/pages/detail/detail?LineId=" + e.currentTarget.dataset.id,
      // })
      wx.navigateToMiniProgram({
        appId: 'wx84facba553e869a1',
        path: "/page/line/pages/detail/detail?LineId=" + e.currentTarget.dataset.id,
        extraData: {
          LineId: e.currentTarget.dataset.id
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (e.currentTarget.dataset.type == 10) { //大礼包优惠券
      wx.switchTab({
        url: '/page/EliteCard/EliteCard'
      })
    }
  },
  // 优惠券列表
  getOrderList: function() {
    var that = this;
    get('/app/member/couponGroupMember', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          notUsed: res.data.data.notUsed,
          overdue: res.data.data.overdue,
          use: res.data.data.use
        })
        if (res.data.data.is_pop == 0) {
          this.setData({
            switchChecked:false
          })
        }else{
          this.setData({
            switchChecked: true
          })
        }
      } else {}
    }, 1, that.data.token, true, that.data.uid)
  },
  // 更改按钮状态，到期提醒
  changeExpire(e){
    var that = this,
      data={
        is_pop: e.detail.value ? 1 : 0,
        mid: this.data.uid
      }
    post('/app/member/memberCouponPopEdit', data, (res) => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
        })
      } else { }
    }, 1, that.data.token, true, that.data.uid)
  },
  onLoad: function(options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })
    this.getOrderList();
  },
  onPullDownRefresh: function() {
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  onShow: function() {
    this.getOrderList();
    wx.setStorageSync('myrequest', '');

  }
})