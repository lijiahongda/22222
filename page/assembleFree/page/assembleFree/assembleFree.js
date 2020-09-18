import {
  get,
  post,
  retrunScene,
  relations
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,
    isHaveMore: true,
    isHaveMoreN:true,
    page: 1,
    authorizationStatus: false,
    pageSizeMore: 10,
    currentTab: 0, //预设当前项的值,
    assemble: false,
    mall: true,
    item:'',
    successCount:'',
    countDownDay: '0',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.getMall()
  },
  getMall:function(){
    let that = this;
    that.setData({
      mall:true,
      assemble: false,
      isHaveMoreN: true,
      page:1
    })
    wx.setNavigationBarTitle({
      title: '拼团商城',
    })
    that.dataList()
  },
  getAssemble: function () {
    let that = this;
    that.setData({
      assemble: true,
      mall: false,
      isHaveMore:true,
      page:1
    })
    that.getMyList()
    wx.setNavigationBarTitle({
      title: '我的拼团',
    })
  },
  
  // 我的拼团顶部tab
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        isHaveMoreN: true
      })
    }
    if (this.data.currentTab == 0) {
      this.setData({
        type: 0,
        page: 1
      })
      this.getMyList()
    } else if (this.data.currentTab == 1) {
      this.setData({
        type: 1,
        page: 1
      })
      this.getMyList()

    } else if (this.data.currentTab == 2) {
      this.setData({
        type: 2,
        page: 1
      })
      this.getMyList()
    } 
  },
  // 拼团商城
  dataList: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
    });
    post('/hd/assembleGoods', {
      page:  1,
      pageSize:10
    }, (res) => {
      if (res.data.code == 200) {
        for (let i of res.data.data.items){
          if (i.successCount >= 10000){
            i.successCount = (i.successCount / 10000).toFixed(2) + '万'
          }
        }
        wx.hideLoading();
        that.setData({
          item: res.data.data.items,
          page: that.data.page + 1,
        })
        console.log('---------')
      } else { }
      wx.hideLoading()
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 我的拼团
  getMyList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    post('/hd/myNewAssembleList', {
      uid: wx.getStorageSync('uid'),
      type: that.data.type,
      page: 1,
      fromType: 2
    }, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        that.setData({
          list: res.data.list,
          page: that.data.page + 1
        })
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    let that = this
    wx.showLoading()
    if (that.data.mall){
      if (this.data.isHaveMore) {
        wx.showLoading()
        post('/hd/assembleGoods', {
          page: that.data.page,
          pageSize: 10
        }, (res) => {
          if (res.data.code == 200) {
            that.setData({
              items: that.data.item.concat(res.data.data.items),
              page: res.data.data.items.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.items.length > 0 ? true : false
            })
          } else {

          }
          wx.hideLoading()
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    }else{
      if (this.data.isHaveMoreN) {
        wx.showLoading()
        post('/hd/MyAssemble', {
          uid: wx.getStorageSync('uid'),
          type: that.data.currentTab,
          page: that.data.page
        }, (res) => {
          if (res.data.code == 200) {
            that.setData({
              list: that.data.list.concat(res.data.list),
              page: res.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMoreN: res.data.list.length > 0 ? true : false
            })
          } else {

          }
          wx.hideLoading()
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    }
    
  },
  detail: function (e) {
    let url = e.currentTarget.dataset.url
    console.log(url)
    wx.navigateTo({
      url: url + '?' + 'teamid' + '=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  detailPt: function (e) {
    let url = e.currentTarget.dataset.url
    console.log(url)
    wx.navigateTo({
      url: url + '?' + 'type=' + e.currentTarget.dataset.type + '&ordersn=' + e.currentTarget.dataset.ordersn + '&id=' + e.currentTarget.dataset.foundid,
    })
  },
  // 切换
  switchs: function (e) {
    let that = this
    that.setData({
      type: e.currentTarget.dataset.type
    })
    if (that.data.type == 'square') {
      // that.selectComponent("#listTwo")._onOption(that.data.list)
    } else {
      // that.selectComponent("#listOne")._onOption(that.data.list)
    }
  },
  startTimer: function (totalSecond) {
    let that = this
    // 倒计时
    var totalSecond;
    // totalSecond = that.data.statrstime
    totalSecond = totalSecond
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
        countDownDay: day
      });
      totalSecond--;
      if (totalSecond < 0) {
        that.detaildata()
        clearInterval(interval);
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
          countDownDay: '0'
        });

      }
    }.bind(this), 1000);
  },
  // 倒计时
  AnotherRoundstartTimer: function (totalSecond, v) {
    let that = this
    // 倒计时
    var totalSecond;
    // totalSecond = that.data.statrstime
    totalSecond = totalSecond
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      this.data.list[v].countDownHour = hrStr;
      this.data.list[v].countDownMinute = minStr;
      this.data.list[v].countDownSecond = secStr;
      this.setData({
        list: this.data.list
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.data.list[v].countDownHour = '00';
        this.data.list[v].countDownMinute = '00';
        this.data.list[v].countDownSecond = '00';
      }
    }.bind(this), 1000);
  },

  // // 页面内分享
  // onShare: function () {
  //   if (wx.getStorageSync('uid')) {
  //     this.setData({
  //       sharelayer: true
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + '' + '&codeNumber=' + ''
  //     })
  //   }
  // },

  // goPoster: function () {
  //   wx.navigateTo({
  //     url: "/page/other/pages/poster/poster?goodsId=" + this.data.activityId + '&url=' + '/share/mallNewIconShareForward' + '&id=mustBuy',
  //   })
  // },
  // // 关闭分享
  // shareLayerClosed: function () {
  //   this.setData({
  //     sharelayer: false
  //   })
  // },

  // postShareImg: function (id) {
  //   let that = this
  //   post('/app/mall/mallShare', {
  //     uid: wx.getStorageSync('uid'),
  //     type: id
  //   }, (res) => {
  //     if (res.data.code == 200) {
  //       that.setData({
  //         shareTitle: res.data.remind,
  //         shareImg: res.data.showImg,
  //       })
  //     }
  //   }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1);
  // },
  onShow: function () {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    // this.initSelected(this.data.colorSize, '100000942707')
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
    }
  
  },
  onShareAppMessage: function (res) {
    let that = this
      var value = ''
      try {
        value = wx.getStorageSync('selfReCode')

      } catch (e) {

      }
      console.log(res)
    console.log("page/assembleFree/page/InitiateGroup/InitiateGroup" + "?reCode=" + value + "&id=" + res.target.dataset.id + '&type=' + 2)
      return {
        title: that.data.share.title,
        imageUrl: that.data.share.img,
        path: "page/assembleFree/page/InitiateGroup/InitiateGroup" + "?reCode=" + value + "&id=" + res.target.dataset.id+ '&type=' + 2
      }

  },
})