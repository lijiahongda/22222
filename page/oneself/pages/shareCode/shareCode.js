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
    img: '',
    uid: '',
    token: ''
  },
  // 复制
  copyText: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {}
        })
      },
      complete(res) {}
    })
  },
  getOrderList: function() {
    var that = this
    post('/app/member/qrcodeV4', {}, (res) => {
      if (res.statusCode == 200) {
        that.setData({
          list: res.data
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid)
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })

    that.getOrderList();
  },
  onPullDownRefresh: function() {
    this.getOrderList();
    wx.stopPullDwnRefresh();
  },
  onShow: function() {
    wx.setStorageSync('myrequest', '');
    // this.getOrderList();
    if (wx.getStorageSync('uid')) {
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
    }

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

    }
    return {
      title: this.data.list.title,
      imageUrl: that.data.list.shareImg,
      path: "/page/Mall/YueMall" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid')
    }

  },
})