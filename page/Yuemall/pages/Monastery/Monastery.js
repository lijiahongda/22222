import {
  get,
  post,
  relations
} from '../../../../utils/util.js';

var app = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    uid: '',
    top: 0,
    token: '',
    currentTab: 0, //预设当前项的值
    curTab: '',
    width: '20%',
    showView: true,
    showViewHeight: false,
    ArrowWidth: '10%',
    Tab: '',
    scrollId: '',
    goodsType: [],
    qualityGoods: true,
    rests: false,
    special: [],
    featureTitle: '',
    feature: [],
    order: [],
    pageSize: 10,
    page: 1,
    authorizationStatus: false,
    cur: '',
    isHaveMore: true,
    quan: [],
    goodTypeId: '',
    showModal: false,
    typeId: ''
  },
  //页面滚动监听
  onPageScroll: function(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  onUnload: function() {
    wx.setStorageSync('curCar', '1')
  },
  //禁止滑动  
  disMove: function() {

  },
  // 初始化数据
  getOrderList: function() {
    let that = this
    let typeid = '&categoryThreeId='
    wx.showLoading({
      title: '加载中',
    });
    console.log('-------')
    if (that.data.goodTypeId == undefined) {
      that.setData({
        goodTypeId: ''
      })
    }
    if (that.data.channelId == 1) {
      typeid = '&categoryThreeId='
    } else if (that.data.channelId == 2) {
      typeid = '&categorySecondId='
    }
    if (that.data.channelId == undefined) {
      that.setData({
        channelId: 0
      })
    }
    if (that.data.typePage == 'quanqiugou') {
      post('/mall/indexShare', {
        uid: wx.getStorageSync('uid')
      }, (res) => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            top100: res.data.data.shareData.allEarth
          })
          wx.hideLoading()
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      post(that.data.url, {
        page: that.data.page,
        pageSize: that.data.pageSize,
        typeId: that.data.goodTypeId,
        parentTypeId: that.data.parentTypeId,
        uid: wx.getStorageSync('uid')
      }, (res) => {
        if (res.data.code == 200) {
          wx.hideLoading()
          that.setData({
            list: res.data.data.goodinfo,
            skuGoodsType: res.data.data.skuGoodsType,
            currentTab: res.data.nowType ? res.data.nowType : res.data.data.nowType,
            page: that.data.page + 1
          })
          if (this.data.goodTypeId == '') {
            that.setData({
              curTab: res.data.data.skuGoodsType[0].goodTypeId,
              currentTab: res.data.data.skuGoodsType[0].goodTypeId,
              Tab: res.data.data.skuGoodsType[0].goodTypeId,
            })
          }
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    }
    if (that.data.typePage == 'jiuyuandian') {
      post('/mall/indexShare', {
        uid: wx.getStorageSync('uid')
      }, (res) => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            top100: res.data.data.shareData.jdSpcial
          })
          wx.hideLoading()
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      // + '?channelId=' + that.data.channelId + '&page=' + that.data.page
      post(that.data.url, {
        uid: that.data.uid,
        page: that.data.page,
        pageSize: that.data.pageSize
      }, (res) => {
        if (res.data.code == 200) {
          console.log(res.data)
          wx.hideLoading()
          that.setData({
            list: res.data.data.goodinfo,
            backImg: res.data.data.backImg,
            skuGoodsType: res.data.data.skuGoodsType,
            currentTab: res.data.data.nowType,
            page: that.data.page + 1
          })
          if (this.data.goodTypeId == '') {
            that.setData({
              curTab: res.data.data.skuGoodsType[0].goodTypeId,
              currentTab: res.data.data.skuGoodsType[0].goodTypeId,
              Tab: res.data.data.skuGoodsType[0].goodTypeId,
            })
          }
        } else {

        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    } else {
      console.log('-----')
      get(that.data.url + '?channelId=' + that.data.channelId + '&categoryFirstId=' + that.data.parentTypeId + typeid + that.data.goodTypeId + '&page=' + that.data.page, {}, (res) => {
        if (res.data.code == 200) {
          console.log(res.data)
          wx.hideLoading()
          that.setData({
            list: res.data.data.goodinfo,
            skuGoodsType: res.data.data.skuGoodsType,
            currentTab: res.data.data.nowType,
            page: that.data.page + 1
          })
          if (this.data.goodTypeId == '') {
            that.setData({
              curTab: res.data.data.typeInfo.skuGoodsType[0].goodTypeId,
              currentTab: res.data.data.typeInfo.skuGoodsType[0].goodTypeId,
              Tab: res.data.data.typeInfo.skuGoodsType[0].goodTypeId,
            })
          }
        } else {

        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    }

  },
  // 详情
  details: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.currentTarget.dataset.goodsid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  // 点击标题切换
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        page: 1,
        goodTypeId: cur,
        isHaveMore: true
      })
    }
    if (cur == this.data.curTab) {
      this.setData({
        qualityGoods: true,
        rests: false
      })
    } else {
      this.setData({
        qualityGoods: false,
        rests: true,
        cur: cur
      })
    }
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.setData({
      howViewHeight: (!this.data.showViewHeight)
    })
    this.getOrderList()
  },
  onShow: function() {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
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
      if (wx.getStorageSync('mapId')) {
        //说明已经授权，去绑定
        console.log('说明已经授权，去绑定======')
        that.setData({
          authorizationStatus: true
        })
      } else {
        //还未授权，去授权
        console.log('还未授权，去授权')
        that.setData({
          authorizationStatus: true
        })
      }
    }
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      cardType: wx.getStorageSync('cardType'),
      url: options.url,
      parentTypeId: options.parentTypeId,
      goodTypeId: options.id,
      channelId: options.channelId,
      typePage: options.typePage
    })
    console.log(options.channelId)
    wx.setNavigationBarTitle({
      title: options.name
    })
    that.getOrderList()
  },
  onPullDownRefresh: function() {
    this.getOrderList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    if (that.data.typePage == 'quanqiugou') {
      if (this.data.isHaveMore) {
        post(that.data.url, {
          page: that.data.page,
          pageSize: that.data.pageSize,
          typeId: that.data.goodTypeId,
          parentTypeId: that.data.parentTypeId,
          uid: wx.getStorageSync('uid')
        }, (res) => {
          if (res.data.code == 200) {
            that.setData({
              list: that.data.list.concat(res.data.data.goodinfo),
              page: res.data.data.goodinfo.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.goodinfo.length > 0 ? true : false
            })
          } else {

          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    }
    if (that.data.typePage == 'jiuyuandian') {
      if (this.data.isHaveMore) {
        post(that.data.url, {
          uid: that.data.uid,
          page: that.data.page,
          pageSize: that.data.pageSize
        }, (res) => {
          if (res.data.code == 200) {
            that.setData({
              list: that.data.list.concat(res.data.data.goodinfo),
              page: res.data.data.goodinfo.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.goodinfo.length > 0 ? true : false
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    } else {
      if (this.data.isHaveMore) {
        let typeid = '&categoryThreeId='
        if (that.data.channelId == 1) {
          typeid = '&categoryThreeId='
        } else if (that.data.channelId == 2) {
          typeid = '&categorySecondId='
        }
        get(that.data.url + '?channelId=' + that.data.channelId + '&categoryFirstId=' + that.data.parentTypeId + typeid + that.data.goodTypeId + '&page=' + that.data.page, {}, (res) => {
          if (res.data.code == 200) {
            that.setData({
              list: that.data.list.concat(res.data.data.goodinfo),
              page: res.data.data.goodinfo.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.goodinfo.length > 0 ? true : false
            })
          } else {

          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    }

  },
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
    console.log("/page/Yuemall/pages/Monastery/Monastery" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid') + '&typePage=' + that.data.typePage + '&parentTypeId=' + that.data.parentTypeId)
    return {
      title: that.data.top100.title,
      imageUrl: that.data.top100.showImg,
      path: "/page/Yuemall/pages/Monastery/Monastery" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid') + '&typePage=' + that.data.typePage + '&parentTypeId=' + that.data.parentTypeId + '&url=' + that.data.url + '&channelId=' + that.data.channelId
    }
  }
})