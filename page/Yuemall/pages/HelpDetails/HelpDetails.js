// page/Mall/pages/HelpDetails/HelpDetails.js
import {
  get,
  post,
  relations,
  retrunScene,
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countDownDay: '0',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
    GroupList: [],
    sharelayer: false,
    FriendsBargain: false, //是否是帮忙砍价
    isFriend: false,
    isChopping: false, //是否帮好友砍过价
    isOneself: true, //是否是自己 false==自己
    isNewPepole: false,
    newSate: false,
    newSate2: false
  },
  login: function() {
    let that = this
    if (wx.getStorageSync('uid')) {//如果登录了
      if (that.data.isFriend) {//是帮别人砍价
        that.FriendsBargain(wx.getStorageSync('uid'), wx.getStorageSync('openid'))//获取砍价弹窗信息
      }
      if (that.data.isChopping) { //是否帮好友砍过价
        that.setData({
          FriendsBargain: false //帮砍弹窗
        })
      }
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
      })
    }

  },
  // 支付
  gopay: function(e) {
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/BargainSettlement/BargainSettlement?bargain_id=' + this.data.bargain.bargain_id + '&found_id=' + this.data.bargain.found_id,
    })
  },
  // 已砍信息
  FriendsBargain: function(uid, openid) {
    let that = this
    console.log(uid, openid, 'zoujikoulemr')
    post('/hd/memberHelpBargain', {
      uid: uid,
      found_id: that.data.found_id,
      open_id: openid
    }, (res) => {

      console.log('jinmeijinzheli进没进嘻嘻嘻嘻嘻嘻嘻嘻寻寻')
      console.log(res)
      console.log('-------------')
      if (res.data.code == 200) {
        console.log('jinmeijinzheli进没进')
        wx.hideLoading()
        // 弹窗信息
        that.setData({
          head_pic: res.data.data.head_pic,//头像
          help_price: res.data.data.help_price,//砍价加个
          newImg: res.data.newImg,//二维码弹窗
        })
        that.setData({
          FriendsBargain: true
        })
      } else if (res.data.code == 401 || res.data.code == 402) { //老人和已参与
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        that.setData({
          isNewPepole: true,//是否是老人和已参与
          FriendsBargain: false,//帮砍弹窗
          isChopping: true,//是否帮砍过依据
          remind: res.data.data.remind//如果是老人和已参与的按钮文字提示
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        that.setData({
          FriendsBargain: false,
          isChopping: true
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
  },
  // 点击领取
  ClickCollect: function() {
    this.setData({
      FriendsBargain: false,
      isclose:true
    })
  },
//点击关闭
  ClickClose: function () {
    wx.redirectTo({
      url: '/page/Yuemall/pages/BargainDetails/BargainDetails?id=' + this.data.bargain.bargain_id,
    })
  },

  // 关闭分享
  shareLayerClosed: function() {
    this.setData({
      sharelayer: false
    })
  },
  // 砍价拼团查看更多列表
  BargainPriceList: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/BargainPriceList/BargainPriceList?title=' + e.currentTarget.dataset.title + '&url=' + e.currentTarget.dataset.url,
    })
  },
  // 打开分享
  shareBox: function() {
    let that = this
    that.setData({
      sharelayer: true
    })
  },
  // 生成海报
  goPoster: function() {
    console.log(this.data.bargain)
    console.log('&skuid=' + this.data.bargain.sku_id)
    this.setData({
      sharelayer: false
    })
    wx.navigateTo({
      url: "/page/other/pages/poster/poster?goodsId=" + this.data.bargain.goods_id + '&url=' + '/share/CreduceForward' + '&id=' + 'BargaingoodsDetail' + '&skuid=' + this.data.bargain.sku_id + '&foundid=' + this.data.bargain.found_id,
    })
  },
  // 初始化数据
  initData: function() {
    let that = this
    post('/hd/memberBargainInfo', {
      uid: that.data.uid,
      found_id: that.data.found_id,
      open_id: wx.getStorageSync('openId')
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          bargain: res.data.data.bargain,
          GroupList: res.data.data.bargainMember,
          isChopping: res.data.data.isBargain,
          isOneself: res.data.data.isOneself,
          share: res.data.data.share,
          shareimg: res.data.data.share.share_img
        })
        if (that.data.isChopping) {
          that.setData({
            FriendsBargain: false
          })
        }
        if (res.data.data.bargain.countDown != 0) {
          that.startTimer(res.data.data.bargain.countDown)
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
      // uid == '' && isFriend && isOneself
      // uid && isFriend && isChopping && isOneself
      // let newuid=that.data.uid;
      // let newisFriend = that.data.isFriend;
      // let newisOneself = that.data.isOneself;
      // let newisChopping = that.data.isChopping;
      // if (newuid == '' && newisFriend && isOneself){
      //   that.setData({
      //     newSate :true
      //   })
      // };
      // if (newuid && newisFriend && isOneself && newisChopping) {
      //   that.setData({
      //     newSate2: true
      //   })
      // }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)

    get('/hd/bargainLists?page=' + 1 + '&channel=' + 7, {}, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          assembleList: res.data.data.item
        })
      } else {

      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 查看更多
  lookMore: function() {
    // this.data.bargain.bargain_id
    wx.navigateTo({
      url: '/page/Yuemall/pages/HaggleList/HaggleList?id=' + this.data.found_id + '&type=' + 2,
    })
  },
  AssembleDetail: function(e) {
    wx.redirectTo({
      url: '/page/Yuemall/pages/BargainDetails/BargainDetails?id=' + e.currentTarget.dataset.id + ' & skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let scene = '';
    let reCode = '';
    let found_id = '';
    let isFriend = '';
    let isclose = false;//二维码
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        reCode = sceneObj.C;
        found_id = sceneObj.I;
        isFriend = sceneObj.F;
      });
    } else {
      reCode = options.reCode;
      found_id = options.found_id;
      isFriend = options.isFriend
    }
    console.log(options)
    that.setData({
      isFriend: isFriend,
      found_id: found_id,
      uid: wx.getStorageSync('uid'),
      isChopping: options.isChopping
    })
    console.log(that.data.isFriend, '444444444')
    that.initData()
  },
  // 倒计时
  startTimer: function(totalSecond) {
    let that = this
    // 倒计时
    var totalSecond;
    // totalSecond = that.data.statrstime
    totalSecond = totalSecond
    var interval = setInterval(function() {
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
        that.assistantList()
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    // this.initSelected(this.data.colorSize, '100000942707')
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }
    console.log('999999999999999999', wx.getStorageSync('uid'))

    if (wx.getStorageSync('uid')) {
      console.log('未登录')
      // 授权并绑定
      that.setData({
        authorizationStatus: false,
        mapId: wx.getStorageSync('mapId'),
        FriendsBargain: true
      })
      if (that.data.isFriend) {
        that.FriendsBargain(wx.getStorageSync('uid'), wx.getStorageSync('openid'))
      }
      if (that.data.isChopping) { //是否帮好友砍过价
        that.setData({
          FriendsBargain: false
        })
      }
    } else {
      //说明已经授权，去绑定
      console.log('未登录')
      that.setData({
        authorizationStatus: false,
        mapId: wx.getStorageSync('mapId'),
        FriendsBargain: false
      })
      if (that.data.isChopping) { //是否帮好友砍过价之后要放到接口里
        that.setData({
          FriendsBargain: false
        })
      }
    }
    console.log(that.data.mapId)
    console.log(that.data.FriendsBargain)
    that.setData({
      uid:wx.getStorageSync('uid')
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    that.setData({
      sharelayer: false
    })
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
    let teamid = "";
    if (options.teamid == null || options.teamid == 'null' || options.teamid == 'undefined' || options.teamid == undefined) {
      teamid = this.data.teamid
    } else {
      teamid = options.teamid;
    }
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {

    }
    console.log("page/Mall/pages/HelpDetails/HelpDetails" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid') + "&isFriend=" + true + '&found_id=' + that.data.found_id)
    console.log(that.data.share.share_img)
    return {
      title: that.data.share.share_title + that.data.share.share_desc,
      imageUrl: that.data.share.share_img,
      path: "page/Yuemall/pages/HelpDetails/HelpDetails" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid') + "&isFriend=" + true + '&found_id=' + that.data.found_id
    }
  }
})