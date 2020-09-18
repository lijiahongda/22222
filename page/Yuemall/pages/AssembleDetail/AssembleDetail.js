// page/Mall/detail/detail.js
import {
  get,
  post,
  wxLogin,
  relations,
  retrunScene,
} from '../../../../utils/util.js';
import WxParse from "../../../../wxParse/wxParse/wxParse.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    three: 5,
    imagenum: 20,
    scrollTop: 0,
    scrollId: '', //选中ID
    tabIndex: 0,
    lineText: [{
      title: '宝贝'
    }, {
      title: '评论'
    }, {
      title: '详情'
    }],
    // 轮播数组
    bannerItem: [{
        url: ''
      },
      {
        url: ''
      }

    ],
    // 授权按钮状态
    authorizationStatus: false,
    countDownDay: '0',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
    isaddress: false,
    // 默认轮播数
    current: 0,
    // 规格弹窗
    showModalStatus: false,
    colorSize: [],
    selectLabel: '请选择规格',
    statusArr: [], //各行规格默认选中项
    sharelayer: false,
    buttonId: 1,
    addressCode: 0,
    amountNumber: 1,
    list: [{
        image: '',
        name: 'www',
        num: 1,
        time: 65602
      },
      {
        image: '',
        name: 'xxx',
        num: 2,
        time: 45602
      },
      {
        image: '',
        name: 'yyy',
        num: 3,
        time: 25602
      }
    ],
    isIdentification:'',
    cardType:0,
    channelIcon:'',
    sizeSelectText: [],
    realName: false, //是否实名
  },
  amountNumberInput: function (e) {
    this.setData({
      amountNumber: e.detail.value
    })
  },
  // 手机号验证码
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  // 查看更多评论
  lookComment: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/lookComment/lookComment?productid=' + this.data.goodsId,
    })
  },
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
  // 点击标题切换
  NavTab: function(e) {
    let that = this
    let cur = e.currentTarget.dataset.index;
    if (that.data.tabIndex == cur) {
      return false;
    } else {
      that.setData({
        tabIndex: cur,
        scrollId: 'd' + cur
      })
      console.log('d' + cur)
    }
  },
  /**
   * 页面滑动
   */
  bindscroll: function(e) {
    let data = this.data
    let scrollTop = e.scrollTop
    this.setData({
      scrollTop: e.detail.scrollTop
    })
    if (e.detail.scrollTop > 100) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#F34746',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
    if (e.detail.scrollTop == 0) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
  },
  // 添加商品数量
  addNumber: function(e) {
    if (this.data.amountNumber == 10) {
      wx.showToast({
        title: '拼团商品最多只能购买10件',
        icon: 'none'
      })
    } else {
      let num = e.currentTarget.dataset.num;
      this.setData({
        amountNumber: num + 1
      })
      if ((this.data.amountNumber > this.data.inventory) && this.data.channelId != 3) {
        wx.showToast({
          title: '库存数不足请重新选择数量',
          icon: 'none'
        })
      }
    }

  },
  // 减少商品数量
  subtract: function(e) {
    let num = e.currentTarget.dataset.num
    if (num != 1) {
      this.setData({
        amountNumber: num - 1
      })
    } else {
      wx.showToast({
        title: '受不了了，宝贝不能在减少了哦',
        icon: 'none'
      })
    }
  },
  // 倒计时
  startTimer: function(totalSecond, v) {
    let that = this
    // 倒计时
    var totalSecond = totalSecond;
    console.log(totalSecond)
    if (totalSecond == 0) {
      console.log('daojishijieshu')
      that.setData({
        // groupInfo: []
      })
    } else {
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
        this.data.groupInfo[v].countDownHour = hrStr;
        this.data.groupInfo[v].countDownMinute = minStr;
        this.data.groupInfo[v].countDownSecond = secStr;
        this.setData({
          groupInfo: this.data.groupInfo
        });

        totalSecond--;
        if (totalSecond < 0) {
          clearInterval(interval);
          this.data.groupInfo[v].countDownHour = '00';
          this.data.groupInfo[v].countDownMinute = '00';
          this.data.groupInfo[v].countDownSecond = '00';
        }
      }.bind(this), 1000);
      // console.log(this.data.groupInfo)
    }

  },
  // 去拼单详情
  GoGroupDetail: function(e) {
    let that = this
    if (that.data.state != 1) {
      wx.showToast({
        title: '请选择配送地址',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/GroupDetail/GroupDetail?id=' + e.currentTarget.dataset.id + '&type=' + 2 + '&areaid=' + that.data.address.addressId,
      })
    }

  },
  // 查看更多拼团
  lookMore: function(e) {
    let that = this
    if (that.data.state != 1) {
      wx.showToast({
        title: '请选择配送地址',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/GroupList/GroupList?team_id=' + that.data.teamid,
      })
    }

  },
  // 生成海报
  goPoster: function() {
    this.setData({
      sharelayer: false
    })
    wx.navigateTo({
      url: "/page/other/pages/poster/poster?goodsId=" + this.data.goodsId + '&url=' + '/share/MallProducTogetherForward' + '&id=' + 'Assemblegoods' + '&skuid=' + this.data.skuid,
    })
  },
  // 打开分享
  shareBox: function() {
    let that = this
    if (wx.getStorageSync('uid')) {
      that.setData({
        sharelayer: true
      })
    }
  },
  // 关闭分享
  shareLayerClosed: function() {
    this.setData({
      sharelayer: false
    })
  },
  // 确定
  sure: function(e) {
    let that = this
    if ((this.data.amountNumber > this.data.inventory) && this.data.channelId != 3) {
      wx.showToast({
        title: '库存数不足请重新选择数量',
        icon: 'none'
      })
    } else {
      if (e.currentTarget.dataset.id == 1) { //单独购买
        if (e.currentTarget.dataset.amountnumber == 0) {
          wx.showToast({
            title: '请选择规格数量',
            icon: 'none'
          })
        } else {
          let addressIds = that.data.addressCode == 0 ? (that.data.address.proviceId + '_' + that.data.address.cityId + '_' + that.data.address.zoneId + '_' + that.data.address.townId) : that.data.addressCode
          let addressType = that.data.channelId == 3 ? 1 : 0
          wx.navigateTo({
            url: '../balance/balance?type=' + 'gopay' + '&amountnumber=' + e.currentTarget.dataset.amountnumber + '&goodid=' + e.currentTarget.dataset.goodid + '&labelName=' + that.data.labelName + '&leaderId=' + that.data.leaderId + '&skuid=' + that.data.skuid + '&addressIds=' + addressIds + '&areaId=' + that.data.address.addressId + '&addressType=' + addressType,
          })
        }
      } else if (e.currentTarget.dataset.id == 2) { //发起拼单
        let addressIds = that.data.addressCode == 0 ? (that.data.address.proviceId + '_' + that.data.address.cityId + '_' + that.data.address.zoneId + '_' + that.data.address.townId) : that.data.addressCode
        wx.redirectTo({
          url: '/page/Yuemall/pages/groupBalance/groupBalance?id=' + that.data.teamid +
            '&goodid=' + that.data.goodsId + '&skuid=' + that.data.skuid + '&areaid=' + that.data.address.addressId + '&addressIds=' + addressIds + '&goodsnum=' + that.data.amountNumber + '&type=' + 1
        })
      }
      that.hideModal()
    }

  },
  // 规格
  swichLabel: function(e) {
    let that = this
    console.log(that.data.colorSize)
    //选中index
    var index = e.currentTarget.dataset.idx;
    //选中行index
    var data_index = e.currentTarget.dataset.index;
    that.selectLabel(index, data_index);
  },
  // 选中lab
  selectLabel(index, data_index) {
    let that = this;
    let colorSize = that.data.colorSize;
    var idx = index;
    //选中sku
    var sku = colorSize[index].buttons[data_index]['skuList']
    //选中第几行第几个
    // console.log(arr.push(colorSize[index].buttons[data_index]))
    that.data.statusArr[index] = data_index
    //取出其他sku
    let m = []
    that.setData({
      sizeSelectText: []
    })
    var is_selected_skus = {};
    that.data.statusArr.map((b, a) => {
      if (a != idx && (typeof that.data.statusArr[a] != "undefined")) {
        is_selected_skus[a] = colorSize[a].buttons[that.data.statusArr[a]].skuList;
        // console.log(colorSize[a].buttons[this.data.statusArr[a]])
      }
      that.data.sizeSelectText.push(colorSize[a].buttons[this.data.statusArr[a]].text)
      // console.log(that.data.sizeSelectText.push(colorSize[a].buttons[this.data.statusArr[a]].text))
    })
    for (let i = 0; i < colorSize.length; i++) {
      var channel_data = colorSize[i].buttons;

      for (let j = 0; j < channel_data.length; j++) {
        if (i != idx) {
          var sku_isists = Array.intersect(sku, channel_data[j].skuList);
          for (let [c, d] in is_selected_skus) {
            if (c != i) {
              sku_isists = Array.intersect(sku_isists, is_selected_skus[c]); //is_selected_skus非当前行其他行选中的元素
            }
          }
          if (sku_isists.length) {
            // console.log('1')
            colorSize[i].buttons[j].isEnable = true;
          } else {
            // console.log('2')

            colorSize[i].buttons[j].isEnable = false;
          }
        } else {
          if (j == data_index) {
            // console.log('3')

            colorSize[i].buttons[j].isEnable = true;
          } else if (colorSize.length == 1) {
            // console.log('4')

            colorSize[i].buttons[j].isEnable = true;
          }
        }
      }
    }
    let last_sku = sku
    for (let [c, d] in is_selected_skus) {
      last_sku = Array.intersect(last_sku, is_selected_skus[c]);
    }
    that.setData({
      statusArr: that.data.statusArr,
      colorSize: colorSize,
      last_sku: last_sku[0],
      skuid: last_sku[0],
      sizeSelectText: that.data.sizeSelectText,
    })
    if (colorSize[index]['title'] == '颜色') {
      that.setData({
        boxbanner: colorSize[index].buttons[data_index]['img']
      })
    }
    // this.skuidDetil()
    // console.log(that.data.sizeSelectText)
  },
  // 未实名 点击确认
  closeRealName: function () {
    this.setData({
      realName: false
    })
    this.hideModal()
  },
  // 选择规格
  SelectionSpecification: function(e) {
    let that = this;
    // 判断 是否实名
    if (that.data.isIdentification==0){
      that.setData({
        realName:true
      })
      return
    }
    if (that.data.state != 1) {
      wx.showToast({
        title: '请选择配送地址',
        icon: 'none'
      })
    } else {
      that.setData({
        buttonId: e.currentTarget.dataset.id
      })
      that.showModal()
    }
  },
  // 轮播 点击事件
  bindChange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  // 首页
  gohome: function() {
    wx.switchTab({
      url: '/page/Mall/YueMall',
    })
  },
  // 显示弹窗
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏弹窗
  hideModal: function() {
    // 隐藏遮罩层
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
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 初始化默认选中项
   */
  initSelected: function(colorsize, skuid) {
    let arr = new Array(colorsize.length)
    for (let i = 0; i < colorsize.length; i++) {
      for (let j = 0; j < colorsize[i].buttons.length; j++) {
        // colorsize[i].buttons[j].skuList.indexOf(Number(skuid)) > -1
        if (colorsize[i].buttons[j].skuList.indexOf(skuid) > -1) {
          // console.log('----')
          this.selectLabel(i, j);
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let scene = '';
    let reCode = '';
    let teamid = '';
    let Modeliphonex = 'iPhone X'
    let ModeliphonePro = 'iPhone Pro'
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        reCode = sceneObj.C;
        teamid = sceneObj.I;
      });
    } else {
      reCode = options.reCode;
      teamid = options.teamid;
    }
    console.log(options.skuid)
    that.setData({
      teamid: teamid,
      skuid: options.skuid,
      uid: wx.getStorageSync('uid')
    })
    console.log(wx.getStorageSync('uid'))
    console.log(that.data.uid)
    that.detaildata()
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        if (res.model.indexOf(Modeliphonex) > -1 || res.model.indexOf(ModeliphonePro) > -1) {
          console.log('---')
          that.setData({
            isFill: true
          })
        }
      }
    })
  },
  address: function() {
    let that = this;
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/addressAdministration/addressAdministration?Mywinning=' + 'datilAss',
      })
    }

  },
  // 电话
  calltel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  detail: function (e) {
    console.log(e.detail)
    wx.navigateTo({
      url: '/page/Yuemall/pages/details/details?goodsId=' + e.detail.data.goodsid + '&skuid=' + e.detail.data.skuid
    })
  },
  detaildata: function() {
    let that = this
    console.log(that.data.uid)
    get('/hd/assembleInfo?id=' + that.data.teamid + '&uid=' + that.data.uid, {}, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        let data = res.data.data
        that.setData({
          banner: data.productInfo.banner,
          team_price: data.assembleInfo.team_price,
          origin_price: data.assembleInfo.origin_price,
          priceName: data.productInfo.priceName,
          needer: data.assembleInfo.needer,
          goods_name: data.assembleInfo.goods_name,
          goods_id: data.assembleInfo.goods_id,
          colorSize: data.productInfo.saleList,
          goodsInfo: data.productInfo.goodsInfo,
          goodFreight: data.productInfo.goodFreight,
          goodsId: data.assembleInfo.goods_id,
          groupInfo: data.groupInfo,
          share_img: data.assembleInfo.share_img,
          share_title: data.assembleInfo.share_title,
          share_desc: data.assembleInfo.share_desc,
          goodSupplier: data.productInfo.goodSupplier,
          comment: data.productInfo.comment,
          cardType: data.identityType,
          channelIcon: data.productInfo.channelIcon,
          isIdentification: data.isIdentification,//判断是否需要实名 0需要 1不需要
        })
        // 推荐
        post('/mall/V2/recommendGoods', {
          uid: wx.getStorageSync('uid'),
          goodsId: res.data.data.product_id
        }, (res) => {
          console.log(res)
          if (res.data.code == 200) {
            that.setData({
              recommendGoods: res.data.data
            })
          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
        let ortherRecode = wx.getStorageSync('ortherReCode') ? wx.getStorageSync('ortherReCode') : 0
        get('/app/member/distribution/record/' + this.data.goodsId + '/' + ortherRecode + '/' + 2, {}, (res) => {
          console.log(res)
          if (res.data.code == 200) {} else if (res.data.code == 400) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
        console.log(that.data.groupInfo)
        for (var v = 0; v < data.groupInfo.length; v++) {
          if (data.groupInfo[v].countDown != 0) {
            that.startTimer(data.groupInfo[v].countDown, v)
          }
        }
        WxParse.wxParse('article', 'html', res.data.data.productInfo.goodContent, that, 5);
        console.log(data.assembleInfo.sku_id)
        that.initSelected(data.productInfo.saleList, data.assembleInfo.sku_id)
        console.log(data.areaInfo)
        if (data.areaInfo != '') {
          if (that.data.isaddress == false) {
            that.setData({
              address: data.areaInfo,
              addressCode: data.areaInfo.proviceId + '_' + data.areaInfo.cityId + '_' + data.areaInfo.zoneId + '_' + data.areaInfo.townId,
              state: data.areaInfo.state,
            })
          }
        }
        that.setData({
          boxbanner: data.productInfo.banner[0]
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
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
    //  wx.clearStorage('uid')
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
    that.setData({
      sharelayer: false
    })
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
    return {
      title: that.data.share_title + that.data.goods_name,
      imageUrl: that.data.share_img,
      path: "page/Yuemall/pages/AssembleDetail/AssembleDetail" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid') + "&teamid=" + that.data.teamid
    }
  }
})